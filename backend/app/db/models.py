from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum, Text, JSON
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.core.db import Base
import enum

def generate_uuid():
    return str(uuid.uuid4())

class UserRole(enum.Enum):
    USER = "user"
    ADMIN = "admin"

class AnalysisStatus(enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETE = "complete"
    FAILED = "failed"

class RecommendationType(enum.Enum):
    DAX = "dax"
    KPI = "kpi"
    CHART = "chart"
    LAYOUT = "layout"
    FILTER = "filter"

class ChatRole(enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"
    TOOL = "tool"

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(UserRole), default=UserRole.USER)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    datasets = relationship("Dataset", back_populates="user")
    chat_sessions = relationship("ChatSession", back_populates="user")

class Dataset(Base):
    __tablename__ = "datasets"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    filename = Column(String)
    storage_path = Column(String)
    file_hash = Column(String)
    row_count = Column(Integer)
    col_count = Column(Integer)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="datasets")
    analyses = relationship("Analysis", back_populates="dataset")
    chat_sessions = relationship("ChatSession", back_populates="dataset")

class Analysis(Base):
    __tablename__ = "analyses"
    id = Column(String, primary_key=True, default=generate_uuid)
    dataset_id = Column(String, ForeignKey("datasets.id"))
    status = Column(Enum(AnalysisStatus), default=AnalysisStatus.PENDING)
    generated_at = Column(DateTime, default=datetime.utcnow)
    
    dataset = relationship("Dataset", back_populates="analyses")
    recommendations = relationship("Recommendation", back_populates="analysis")

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(String, primary_key=True, default=generate_uuid)
    analysis_id = Column(String, ForeignKey("analyses.id"))
    type = Column(Enum(RecommendationType))
    payload = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    analysis = relationship("Analysis", back_populates="recommendations")

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    dataset_id = Column(String, ForeignKey("datasets.id"))
    started_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="chat_sessions")
    dataset = relationship("Dataset", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(String, primary_key=True, default=generate_uuid)
    session_id = Column(String, ForeignKey("chat_sessions.id"))
    role = Column(Enum(ChatRole))
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    session = relationship("ChatSession", back_populates="messages")
