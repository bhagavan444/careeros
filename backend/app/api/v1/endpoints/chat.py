from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from fastapi.responses import StreamingResponse
import asyncio
from typing import Dict, List
from app.services.chat_orchestrator import ChatOrchestrator
from datetime import datetime
import uuid
import json
import logging

from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Chat, Message
from app.api.deps import get_current_user

logger = logging.getLogger("chat_endpoint")

router = APIRouter()
router_engine = ChatOrchestrator()

# ─── Helper Functions ──────────────────────────────────────────────────────────

def generate_chat_title(message: str) -> str:
    """Smart heuristic title generation for cleaner sidebar titles."""
    msg_lower = message.lower()
    
    # Simple keyword mapping for common intents
    if "resume" in msg_lower: return "Resume Review"
    if "github" in msg_lower: return "GitHub Analysis"
    if "interview" in msg_lower: return "Interview Prep"
    if "roadmap" in msg_lower or "path" in msg_lower: return "Career Roadmap"
    if "skill" in msg_lower or "learn" in msg_lower: return "Skill Development"
    if "profile" in msg_lower: return "Profile Optimization"
    if "system design" in msg_lower: return "System Design"
    if "python" in msg_lower: return "Python Help"
    if "react" in msg_lower: return "React Help"
    
    # Fallback to first few words capitalized
    words = message.split()
    if not words:
        return "New Chat"
    
    title = " ".join(words[:4]).strip().title()
    if title.endswith(('.', '?', '!', ',')):
        title = title[:-1]
    
    return title


# ─── CRUD Operations ────────────────────────────────────────────────────────────

@router.get("/health")
async def chat_health():
    return {
        "model": "gemini-2.5-flash",
        "status": "ready"
    }

@router.get("/chats")
async def get_chats(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    chats = db.query(Chat).filter(Chat.user_id == user["uid"]).order_by(Chat.updated_at.desc()).all()
    
    sessions = []
    for chat in chats:
        sessions.append({
            "_id": str(chat.id),
            "title": chat.title,
            "is_pinned": chat.is_pinned,
            "createdAt": chat.created_at.isoformat(),
            "updatedAt": chat.updated_at.isoformat()
        })
    return {"sessions": sessions}


@router.post("/chats")
async def create_chat(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    chat_id = uuid.uuid4()
    new_chat = Chat(
        id=chat_id,
        user_id=user["uid"],
        title="New Chat"
    )
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return {"chat_id": str(chat_id)}


@router.get("/chats/{chat_id}")
async def get_chat(
    chat_id: uuid.UUID,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == user["uid"]).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
        
    messages = db.query(Message).filter(Message.chat_id == chat.id).order_by(Message.created_at.asc()).all()
    
    return {
        "id": str(chat.id),
        "title": chat.title,
        "is_pinned": chat.is_pinned,
        "messages": [
            {
                "role": m.role,
                "message": m.content,
                "source": m.source,
                "confidence": m.confidence,
                "time": m.created_at.isoformat()
            } for m in messages
        ]
    }


@router.patch("/chats/{chat_id}")
async def update_chat(
    chat_id: uuid.UUID,
    update_data: dict,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == user["uid"]).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
        
    if "title" in update_data:
        chat.title = update_data["title"]
    if "is_pinned" in update_data:
        chat.is_pinned = update_data["is_pinned"]
        
    db.commit()
    return {"success": True}


@router.delete("/chats/{chat_id}")
async def delete_chat(
    chat_id: uuid.UUID,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == user["uid"]).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
        
    db.delete(chat)
    db.commit()
    return {"success": True}


@router.delete("/chats")
async def delete_all_chats(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    db.query(Chat).filter(Chat.user_id == user["uid"]).delete()
    db.commit()
    return {"success": True}


# ─── SSE Streaming Chat Endpoint ───────────────────────────────────────────────

@router.post("/stream/{session_id}")
async def sse_chat(
    session_id: uuid.UUID, 
    query: dict,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    """
    Server-Sent Events (SSE) endpoint for streaming AI responses.
    Saves to PostgreSQL database instead of memory.
    """
    user_message = (query.get("message") or "").strip()

    if not user_message:
        return {"error": "Message cannot be empty"}

    # Ensure chat exists and belongs to user
    chat = db.query(Chat).filter(Chat.id == session_id, Chat.user_id == user["uid"]).first()
    if not chat:
        # Create it automatically if it was somehow skipped, or if frontend generated ID
        chat = Chat(id=session_id, user_id=user["uid"], title=generate_chat_title(user_message))
        db.add(chat)
    else:
        # Auto-title on first message
        msg_count = db.query(Message).filter(Message.chat_id == chat.id).count()
        if msg_count == 0:
            chat.title = generate_chat_title(user_message)
            
    chat.updated_at = datetime.utcnow()
    
    # Store user message
    db_user_msg = Message(
        chat_id=chat.id,
        role="user",
        content=user_message
    )
    db.add(db_user_msg)
    db.commit()

    async def sse_generator():
        full_reply = ""
        source = "Gemini AI"
        confidence = 0.95
        
        try:
            # We can't use the injected `db` Session inside the generator because 
            # it might be closed after the HTTP response returns StreamingResponse.
            # We must create a new session scoped to the generator.
            from app.db.session import SessionLocal
            generator_db = SessionLocal()
            
            async for token in router_engine.process_message_stream(user_message, str(session_id)):
                if token:
                    if isinstance(token, dict):
                        if token.get("type") == "meta":
                            source = token.get("source", source)
                            confidence = token.get("confidence", confidence)
                            yield f"data: {json.dumps(token)}\n\n"
                        elif token.get("type") == "chunk":
                            full_reply += token["text"]
                            yield f"data: {json.dumps(token)}\n\n"
                    else:
                        full_reply += str(token)
                        payload = json.dumps({"type": "chunk", "text": str(token)})
                        yield f"data: {payload}\n\n"

            # Save assistant response
            if full_reply.strip():
                db_assistant_msg = Message(
                    chat_id=chat.id,
                    role="assistant",
                    content=full_reply,
                    source=source,
                    confidence=confidence
                )
                generator_db.add(db_assistant_msg)
                
                # Update chat timestamp
                generator_chat = generator_db.query(Chat).filter(Chat.id == session_id).first()
                if generator_chat:
                    generator_chat.updated_at = datetime.utcnow()
                    
                generator_db.commit()
                generator_db.close()

            yield "data: [DONE]\n\n"

        except Exception as e:
            logger.error(f"SSE stream error for session {session_id}: {e}", exc_info=True)
            error_text = "\n\n⚠️ An error occurred while generating the response."
            full_reply += error_text
            yield f"data: {json.dumps({'text': error_text})}\n\n"

            # Save partial response if we failed midway
            if full_reply.strip():
                try:
                    generator_db.add(Message(
                        chat_id=chat.id,
                        role="assistant",
                        content=full_reply,
                        source="System Fallback",
                        confidence=0.0
                    ))
                    generator_db.commit()
                    generator_db.close()
                except:
                    pass

            yield "data: [DONE]\n\n"

    return StreamingResponse(
        sse_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


# ─── Non-Streaming Chat Endpoint ──────────────────────────────────────────────

@router.post("/message/{session_id}")
async def non_streaming_chat(
    session_id: str, 
    query: dict,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    """
    Non-streaming fallback endpoint.
    """
    user_message = (query.get("message") or "").strip()

    if not user_message:
        return {"reply": "Message cannot be empty", "chat_id": session_id}

    chat = db.query(Chat).filter(Chat.id == session_id, Chat.user_id == user["uid"]).first()
    if not chat:
        chat = Chat(id=session_id, user_id=user["uid"], title=generate_chat_title(user_message))
        db.add(chat)
    else:
        msg_count = db.query(Message).filter(Message.chat_id == chat.id).count()
        if msg_count == 0:
            chat.title = generate_chat_title(user_message)
            
    chat.updated_at = datetime.utcnow()
    
    db_user_msg = Message(chat_id=chat.id, role="user", content=user_message)
    db.add(db_user_msg)
    db.commit()

    full_reply = ""
    source = "Gemini AI"
    confidence = 0.95
    
    try:
        async for token in router_engine.process_message_stream(user_message, session_id):
            if token:
                if isinstance(token, dict):
                    if token.get("type") == "meta":
                        source = token.get("source", source)
                        confidence = token.get("confidence", confidence)
                    elif token.get("type") == "chunk":
                        full_reply += token["text"]
                else:
                    full_reply += str(token)
    except Exception as e:
        logger.error(f"Non-streaming chat error: {e}", exc_info=True)
        full_reply = "I encountered an issue generating a response. Please try again."
        source = "System Fallback"
        confidence = 0.0

    if not full_reply.strip():
        full_reply = "I couldn't generate a response. Please try again."

    db_assistant_msg = Message(
        chat_id=chat.id,
        role="assistant",
        content=full_reply,
        source=source,
        confidence=confidence
    )
    db.add(db_assistant_msg)
    db.commit()

    return {"reply": full_reply, "chat_id": session_id}
