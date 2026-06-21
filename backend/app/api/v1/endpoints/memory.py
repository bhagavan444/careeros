from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import UserMemory, SavedInsight
from app.api.deps import get_current_user
import uuid

router = APIRouter()

# ─── Career Memory ────────────────────────────────────────────────────────────

@router.get("/context")
async def get_user_memory(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    memories = db.query(UserMemory).filter(UserMemory.user_id == user["uid"]).all()
    return {m.memory_key: m.memory_value for m in memories}

@router.post("/context")
async def update_user_memory(
    memory_key: str,
    memory_value: dict,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    mem = db.query(UserMemory).filter(UserMemory.user_id == user["uid"], UserMemory.memory_key == memory_key).first()
    if mem:
        mem.memory_value = memory_value
    else:
        mem = UserMemory(
            id=uuid.uuid4(),
            user_id=user["uid"],
            memory_key=memory_key,
            memory_value=memory_value
        )
        db.add(mem)
    db.commit()
    return {"success": True, "key": memory_key}

# ─── Saved Insights ──────────────────────────────────────────────────────────

@router.get("/insights")
async def get_saved_insights(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    insights = db.query(SavedInsight).filter(SavedInsight.user_id == user["uid"]).order_by(SavedInsight.created_at.desc()).all()
    return {
        "insights": [
            {
                "id": str(i.id),
                "title": i.title,
                "content": i.content,
                "source": i.source,
                "tags": i.tags,
                "created_at": i.created_at.isoformat()
            } for i in insights
        ]
    }

@router.post("/insights")
async def save_insight(
    insight: dict,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    new_insight = SavedInsight(
        id=uuid.uuid4(),
        user_id=user["uid"],
        title=insight.get("title", "Saved Insight"),
        content=insight.get("content", ""),
        source=insight.get("source", "Copilot"),
        tags=insight.get("tags", [])
    )
    db.add(new_insight)
    db.commit()
    return {"success": True, "id": str(new_insight.id)}

@router.delete("/insights/{insight_id}")
async def delete_insight(
    insight_id: str,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    insight = db.query(SavedInsight).filter(SavedInsight.id == insight_id, SavedInsight.user_id == user["uid"]).first()
    if not insight:
        raise HTTPException(status_code=404, detail="Insight not found")
        
    db.delete(insight)
    db.commit()
    return {"success": True}

# ─── Activity Feed ────────────────────────────────────────────────────────────

from app.db.models import ActivityFeed

@router.get("/feed")
async def get_activity_feed(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    feed = db.query(ActivityFeed).filter(ActivityFeed.user_id == user["uid"]).order_by(ActivityFeed.timestamp.desc()).limit(50).all()
    return {
        "feed": [
            {
                "id": str(f.id),
                "action_type": f.action_type,
                "description": f.description,
                "timestamp": f.timestamp.isoformat()
            } for f in feed
        ]
    }
