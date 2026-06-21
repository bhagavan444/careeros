from sqlalchemy import Column, String, Text, Integer, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from .database import Base

class Chat(Base):
    __tablename__ = "fastapi_chats"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(128), index=True, nullable=False) # Firebase UID
    title = Column(String(255), default="New Chat")
    is_pinned = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "fastapi_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chat_id = Column(UUID(as_uuid=True), ForeignKey("fastapi_chats.id"), nullable=False, index=True)
    role = Column(String(50), nullable=False) # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    source = Column(String(128), nullable=True) # e.g. "Resume Engine", "Gemini"
    confidence = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    chat = relationship("Chat", back_populates="messages")


class UserMemory(Base):
    __tablename__ = "fastapi_user_memory"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(128), index=True, nullable=False) # Firebase UID
    memory_key = Column(String(255), nullable=False) # e.g. "target_role", "resume_score"
    memory_value = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SavedInsight(Base):
    __tablename__ = "fastapi_saved_insights"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(128), index=True, nullable=False) # Firebase UID
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    source = Column(String(128), nullable=True)
    tags = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ActivityFeed(Base):
    __tablename__ = "fastapi_activity_feed"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(128), index=True, nullable=False) # Firebase UID
    action_type = Column(String(128), nullable=False) # e.g. "Resume Analysis Completed"
    description = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
