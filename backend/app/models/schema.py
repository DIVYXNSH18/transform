from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class TransformationSession(Base):
    __tablename__ = "transformation_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    session_uuid = Column(String, unique=True, index=True, nullable=False)
    raw_text = Column(String)
    ico_json = Column(String)
    slides_json = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
