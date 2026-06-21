import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.db.models import UserMemory, ActivityFeed
import logging

logger = logging.getLogger("memory_service")

def log_activity(db: Session, user_id: str, action_type: str, description: str = ""):
    """Logs an event to the ActivityFeed."""
    try:
        activity = ActivityFeed(
            id=uuid.uuid4(),
            user_id=user_id,
            action_type=action_type,
            description=description,
            timestamp=datetime.utcnow()
        )
        db.add(activity)
        db.commit()
    except Exception as e:
        logger.error(f"Failed to log activity: {e}")

def _upsert_memory(db: Session, user_id: str, memory_key: str, memory_value: dict):
    mem = db.query(UserMemory).filter(UserMemory.user_id == user_id, UserMemory.memory_key == memory_key).first()
    if mem:
        mem.memory_value = memory_value
        mem.updated_at = datetime.utcnow()
    else:
        mem = UserMemory(
            id=uuid.uuid4(),
            user_id=user_id,
            memory_key=memory_key,
            memory_value=memory_value
        )
        db.add(mem)

def update_resume_memory(db: Session, user_id: str, score: int, gaps: list, recommendations: list):
    try:
        _upsert_memory(db, user_id, "resume_score", {"score": score})
        _upsert_memory(db, user_id, "skill_gaps", {"gaps": gaps})
        _upsert_memory(db, user_id, "resume_recommendations", {"recommendations": recommendations})
        db.commit()
        log_activity(db, user_id, "Resume Analysis Completed", f"Scored {score}/100")
        log_activity(db, user_id, "Career Memory Updated", "Resume data synchronized")
    except Exception as e:
        logger.error(f"Failed to update resume memory: {e}")

def update_github_memory(db: Session, user_id: str, score: int, top_languages: list):
    try:
        _upsert_memory(db, user_id, "github_score", {"score": score})
        _upsert_memory(db, user_id, "github_languages", {"languages": top_languages})
        db.commit()
        log_activity(db, user_id, "GitHub Analysis Completed", f"Scored {score}/100")
        log_activity(db, user_id, "Career Memory Updated", "GitHub data synchronized")
    except Exception as e:
        logger.error(f"Failed to update github memory: {e}")

def update_profile_memory(db: Session, user_id: str, target_role: str, career_readiness: int):
    try:
        _upsert_memory(db, user_id, "target_role", {"role": target_role})
        _upsert_memory(db, user_id, "career_readiness", {"score": career_readiness})
        db.commit()
        log_activity(db, user_id, "Profile Intelligence Generated", f"Target: {target_role}")
    except Exception as e:
        logger.error(f"Failed to update profile memory: {e}")

def update_recruiter_memory(db: Session, user_id: str, confidence_level: str, notes: str):
    try:
        _upsert_memory(db, user_id, "recruiter_confidence", {"level": confidence_level, "notes": notes})
        db.commit()
        log_activity(db, user_id, "Recruiter Review Generated", f"Confidence: {confidence_level}")
    except Exception as e:
        logger.error(f"Failed to update recruiter memory: {e}")

def update_roadmap_memory(db: Session, user_id: str, next_steps: list):
    try:
        _upsert_memory(db, user_id, "career_roadmap", {"next_steps": next_steps})
        db.commit()
        log_activity(db, user_id, "Roadmap Generated", "Career roadmap path calculated")
    except Exception as e:
        logger.error(f"Failed to update roadmap memory: {e}")
