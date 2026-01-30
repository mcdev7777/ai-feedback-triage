from pydantic import BaseModel, Field
from typing import Literal
from enum import Enum

class FeedbackCategory(str, Enum):
    BUG_REPORT = "Bug Report"
    FEATURE_REQUEST = "Feature Request"
    PRAISE_POSITIVE = "Praise/Positive Feedback"
    GENERAL_INQUIRY = "General Inquiry"

class TriageRequest(BaseModel):
    text: str = Field(..., max_length=1000, min_length=1, description="Feedback text to triage")

class TriageResponse(BaseModel):
    feedback_text: str
    category: FeedbackCategory
    urgency_score: Literal[1, 2, 3, 4, 5]

class ErrorResponse(BaseModel):
    error: str
    message: str
    status_code: int