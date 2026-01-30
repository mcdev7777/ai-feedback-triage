from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
import logging

from ..services.feedback_service import FeedbackService
from ..database.connection import get_db
from ..models.database import FeedbackRecord

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/dashboard/stats")
async def get_dashboard_stats(
    days_back: int = Query(30, ge=1, le=365, description="Number of days back to analyze"),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """Get comprehensive dashboard statistics."""
    try:
        feedback_service = FeedbackService(db)
        stats = await feedback_service.get_dashboard_stats(days_back=days_back)
        return stats
    except Exception as e:
        logger.error(f"Error getting dashboard stats: {str(e)}")
        raise

@router.get("/dashboard/feedback")
async def get_feedback_history(
    limit: int = Query(50, ge=1, le=1000, description="Number of records to return"),
    offset: int = Query(0, ge=0, description="Number of records to skip"),
    category: Optional[str] = Query(None, description="Filter by category"),
    urgency_min: Optional[int] = Query(None, ge=1, le=5, description="Minimum urgency score"),
    urgency_max: Optional[int] = Query(None, ge=1, le=5, description="Maximum urgency score"),
    days_back: Optional[int] = Query(None, ge=1, le=365, description="Filter by days back"),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """Get paginated feedback history with optional filters."""
    try:
        feedback_service = FeedbackService(db)
        records = await feedback_service.get_feedback_history(
            limit=limit,
            offset=offset,
            category=category,
            urgency_min=urgency_min,
            urgency_max=urgency_max,
            days_back=days_back
        )
        
        # Convert to dictionaries
        feedback_list = [record.to_dict() for record in records]
        
        return {
            "feedback": feedback_list,
            "count": len(feedback_list),
            "offset": offset,
            "limit": limit,
            "filters": {
                "category": category,
                "urgency_min": urgency_min,
                "urgency_max": urgency_max,
                "days_back": days_back
            }
        }
    except Exception as e:
        logger.error(f"Error getting feedback history: {str(e)}")
        raise

@router.get("/dashboard/search")
async def search_feedback(
    q: str = Query(..., min_length=1, description="Search term"),
    limit: int = Query(50, ge=1, le=200, description="Number of results to return"),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """Search feedback by text content."""
    try:
        feedback_service = FeedbackService(db)
        records = await feedback_service.search_feedback(
            search_term=q,
            limit=limit
        )
        
        feedback_list = [record.to_dict() for record in records]
        
        return {
            "feedback": feedback_list,
            "count": len(feedback_list),
            "search_term": q
        }
    except Exception as e:
        logger.error(f"Error searching feedback: {str(e)}")
        raise

@router.get("/dashboard/categories")
async def get_available_categories(
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """Get list of available feedback categories for filtering."""
    categories = [
        "Bug Report",
        "Feature Request", 
        "Praise/Positive Feedback",
        "General Inquiry"
    ]
    
    urgency_levels = [
        {"value": 1, "label": "Not Urgent"},
        {"value": 2, "label": "Low"},
        {"value": 3, "label": "Medium"},
        {"value": 4, "label": "High"},
        {"value": 5, "label": "Critical"}
    ]
    
    return {
        "categories": categories,
        "urgency_levels": urgency_levels
    }