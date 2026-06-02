from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Use SQLite for local development to avoid heavy PostgreSQL setup for the user initially
# In production, this would be swapped to asyncpg + postgresql
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./powerbi_copilot.db")

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
