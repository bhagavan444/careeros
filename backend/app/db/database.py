from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# We expect POSTGRES_URI to be set in .env
# Example: postgresql://user:password@localhost/career_os
SQLALCHEMY_DATABASE_URL = os.getenv("POSTGRES_URI")

if not SQLALCHEMY_DATABASE_URL or "@db:" in SQLALCHEMY_DATABASE_URL:
    # Fallback to local SQLite if POSTGRES_URI is missing or pointing to a Docker hostname 'db'
    SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./fallback.db")

# Force sync driver for create_engine if asyncpg is provided
SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
