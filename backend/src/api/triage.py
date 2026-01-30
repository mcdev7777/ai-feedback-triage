from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
import logging
import time
import os
from collections import defaultdict, deque

from ..models.triage import TriageRequest, TriageResponse, ErrorResponse
from ..services.llm_service import LLMService
from ..services.feedback_service import FeedbackService
from ..database.connection import get_db

logger = logging.getLogger(__name__)

router = APIRouter()
llm_service = LLMService()

# Simple rate limiting: max 10 requests per minute per IP
rate_limit_requests = defaultdict(lambda: deque())
RATE_LIMIT_MAX_REQUESTS = int(os.getenv("RATE_LIMIT_MAX_REQUESTS", "10"))
RATE_LIMIT_WINDOW = int(os.getenv("RATE_LIMIT_WINDOW", "60"))  # seconds

def check_rate_limit(client_ip: str) -> bool:
    """Check if client has exceeded rate limit."""
    # Skip rate limiting in test environment
    if os.getenv("TESTING") == "true":
        return True
        
    now = time.time()
    requests = rate_limit_requests[client_ip]
    
    # Remove old requests outside the time window
    while requests and requests[0] <= now - RATE_LIMIT_WINDOW:
        requests.popleft()
    
    # Check if under limit
    if len(requests) >= RATE_LIMIT_MAX_REQUESTS:
        return False
    
    # Add current request
    requests.append(now)
    return True

def clear_rate_limits():
    """Clear all rate limit data - useful for testing."""
    rate_limit_requests.clear()

@router.post("/triage", response_model=TriageResponse)
async def triage_feedback(
    request: TriageRequest, 
    http_request: Request,
    db: AsyncSession = Depends(get_db)
):
    start_time = time.time()
    
    try:
        # Rate limiting check
        client_ip = http_request.client.host if http_request.client else "unknown"
        if not check_rate_limit(client_ip):
            error_response = ErrorResponse(
                error="Rate Limit Exceeded",
                message="Too many requests. Please wait before trying again.",
                status_code=429
            )
            return JSONResponse(
                status_code=429,
                content=error_response.model_dump(),
                headers={"Retry-After": "60"}
            )
        
        # Additional input validation
        if not request.text or not request.text.strip():
            raise ValueError("Feedback text cannot be empty or whitespace only")
        
        # Remove excessive whitespace
        cleaned_text = " ".join(request.text.strip().split())
        
        logger.info(f"Processing feedback triage for text: {cleaned_text[:50]}...")
        
        # Analyze feedback with LLM
        result = await llm_service.analyze_feedback(cleaned_text)
        
        # Calculate processing time
        processing_time_ms = (time.time() - start_time) * 1000
        
        # Store in database
        feedback_service = FeedbackService(db)
        await feedback_service.create_feedback_record(
            feedback_text=cleaned_text,
            category=result["category"],
            urgency_score=result["urgency_score"],
            client_ip=client_ip,
            processing_time_ms=processing_time_ms
        )
        
        response = TriageResponse(
            feedback_text=cleaned_text,
            category=result["category"],
            urgency_score=result["urgency_score"]
        )
        
        logger.info(f"Triage completed: {result['category']}, urgency: {result['urgency_score']}, time: {processing_time_ms:.2f}ms")
        return response
        
    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}")
        error_response = ErrorResponse(
            error="Validation Error",
            message=str(e),
            status_code=400
        )
        return JSONResponse(
            status_code=400,
            content=error_response.model_dump()
        )
        
    except Exception as e:
        logger.error(f"Internal server error: {str(e)}")
        error_response = ErrorResponse(
            error="Internal Server Error",
            message="An error occurred while processing the feedback. Please try again later.",
            status_code=500
        )
        return JSONResponse(
            status_code=500,
            content=error_response.model_dump()
        )