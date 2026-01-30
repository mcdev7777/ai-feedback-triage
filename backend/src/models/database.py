from sqlalchemy import Column, Integer, String, DateTime, Float, Text, Index
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional

from ..database.connection import Base

class FeedbackRecord(Base):
    __tablename__ = "feedback_records"
    
    id = Column(Integer, primary_key=True, index=True)
    feedback_text = Column(Text, nullable=False)
    category = Column(String(50), nullable=False, index=True)
    urgency_score = Column(Integer, nullable=False, index=True)
    client_ip = Column(String(45), nullable=True, index=True)  # IPv6 compatible
    processing_time_ms = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Add composite indexes for common queries
    __table_args__ = (
        Index('idx_category_urgency', 'category', 'urgency_score'),
        Index('idx_created_urgency', 'created_at', 'urgency_score'),
        Index('idx_category_created', 'category', 'created_at'),
    )
    
    def to_dict(self):
        return {
            "id": self.id,
            "feedback_text": self.feedback_text,
            "category": self.category,
            "urgency_score": self.urgency_score,
            "client_ip": self.client_ip,
            "processing_time_ms": self.processing_time_ms,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }