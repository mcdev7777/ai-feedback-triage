from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, and_
from sqlalchemy.sql import text
from datetime import datetime, timedelta

from ..models.database import FeedbackRecord

class FeedbackService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_feedback_record(
        self,
        feedback_text: str,
        category: str,
        urgency_score: int,
        client_ip: Optional[str] = None,
        processing_time_ms: Optional[float] = None
    ) -> FeedbackRecord:
        """Create a new feedback record in the database."""
        record = FeedbackRecord(
            feedback_text=feedback_text,
            category=category,
            urgency_score=urgency_score,
            client_ip=client_ip,
            processing_time_ms=processing_time_ms
        )
        self.db.add(record)
        await self.db.commit()
        await self.db.refresh(record)
        return record
    
    async def get_feedback_history(
        self,
        limit: int = 100,
        offset: int = 0,
        category: Optional[str] = None,
        urgency_min: Optional[int] = None,
        urgency_max: Optional[int] = None,
        days_back: Optional[int] = None
    ) -> List[FeedbackRecord]:
        """Get paginated feedback history with optional filters."""
        query = select(FeedbackRecord).order_by(desc(FeedbackRecord.created_at))
        
        # Apply filters
        conditions = []
        if category:
            conditions.append(FeedbackRecord.category == category)
        if urgency_min is not None:
            conditions.append(FeedbackRecord.urgency_score >= urgency_min)
        if urgency_max is not None:
            conditions.append(FeedbackRecord.urgency_score <= urgency_max)
        if days_back is not None:
            cutoff_date = datetime.utcnow() - timedelta(days=days_back)
            conditions.append(FeedbackRecord.created_at >= cutoff_date)
        
        if conditions:
            query = query.where(and_(*conditions))
        
        query = query.limit(limit).offset(offset)
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_dashboard_stats(self, days_back: int = 30) -> Dict[str, Any]:
        """Get comprehensive dashboard statistics."""
        cutoff_date = datetime.utcnow() - timedelta(days=days_back)
        
        # Total feedback count
        total_query = select(func.count(FeedbackRecord.id)).where(
            FeedbackRecord.created_at >= cutoff_date
        )
        total_result = await self.db.execute(total_query)
        total_feedback = total_result.scalar()
        
        # Category distribution
        category_query = select(
            FeedbackRecord.category,
            func.count(FeedbackRecord.id).label('count')
        ).where(
            FeedbackRecord.created_at >= cutoff_date
        ).group_by(FeedbackRecord.category)
        
        category_result = await self.db.execute(category_query)
        category_distribution = {row.category: row.count for row in category_result}
        
        # Urgency distribution
        urgency_query = select(
            FeedbackRecord.urgency_score,
            func.count(FeedbackRecord.id).label('count')
        ).where(
            FeedbackRecord.created_at >= cutoff_date
        ).group_by(FeedbackRecord.urgency_score)
        
        urgency_result = await self.db.execute(urgency_query)
        urgency_distribution = {row.urgency_score: row.count for row in urgency_result}
        
        # Average processing time
        avg_time_query = select(func.avg(FeedbackRecord.processing_time_ms)).where(
            and_(
                FeedbackRecord.created_at >= cutoff_date,
                FeedbackRecord.processing_time_ms.isnot(None)
            )
        )
        avg_time_result = await self.db.execute(avg_time_query)
        avg_processing_time = avg_time_result.scalar() or 0
        
        # Daily feedback trend (last 7 days)
        daily_trend_query = select(
            func.date(FeedbackRecord.created_at).label('date'),
            func.count(FeedbackRecord.id).label('count')
        ).where(
            FeedbackRecord.created_at >= datetime.utcnow() - timedelta(days=7)
        ).group_by(func.date(FeedbackRecord.created_at)).order_by('date')
        
        daily_trend_result = await self.db.execute(daily_trend_query)
        daily_trend = [
            {"date": str(row.date), "count": row.count} 
            for row in daily_trend_result
        ]
        
        # Most urgent recent feedback
        urgent_query = select(FeedbackRecord).where(
            and_(
                FeedbackRecord.created_at >= cutoff_date,
                FeedbackRecord.urgency_score >= 4
            )
        ).order_by(desc(FeedbackRecord.urgency_score), desc(FeedbackRecord.created_at)).limit(5)
        
        urgent_result = await self.db.execute(urgent_query)
        urgent_feedback = [record.to_dict() for record in urgent_result.scalars()]
        
        return {
            "total_feedback": total_feedback,
            "category_distribution": category_distribution,
            "urgency_distribution": urgency_distribution,
            "avg_processing_time_ms": round(avg_processing_time, 2),
            "daily_trend": daily_trend,
            "urgent_feedback": urgent_feedback,
            "time_period_days": days_back
        }
    
    async def search_feedback(
        self,
        search_term: str,
        limit: int = 50
    ) -> List[FeedbackRecord]:
        """Search feedback by text content."""
        query = select(FeedbackRecord).where(
            FeedbackRecord.feedback_text.ilike(f"%{search_term}%")
        ).order_by(desc(FeedbackRecord.created_at)).limit(limit)
        
        result = await self.db.execute(query)
        return result.scalars().all()