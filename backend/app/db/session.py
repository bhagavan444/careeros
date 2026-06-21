from .database import SessionLocal, engine, Base
import logging

logger = logging.getLogger("db_session")

def init_db():
    try:
        from . import models
        # Create all tables explicitly defined in models.py
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified/created successfully.")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
