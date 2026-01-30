import pytest
from unittest.mock import AsyncMock, MagicMock
import os
import sys
from pathlib import Path

# Add backend/src to path for imports
backend_src = Path(__file__).parent / "src"
sys.path.insert(0, str(backend_src))

# Set test environment variables
os.environ["LLM_API_KEY"] = "test_key"
os.environ["TESTING"] = "true"
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"

@pytest.fixture(scope="session")
def mock_db():
    """Mock database session that doesn't actually connect to database."""
    mock_session = AsyncMock()
    mock_session.close = AsyncMock()
    mock_session.commit = AsyncMock()
    mock_session.rollback = AsyncMock()
    mock_session.add = MagicMock()
    mock_session.execute = AsyncMock()
    mock_session.scalars = AsyncMock()
    return mock_session

@pytest.fixture(autouse=True)
def mock_database_dependency(monkeypatch, mock_db):
    """Automatically mock database dependencies in all tests."""
    from unittest.mock import AsyncMock
    
    # Mock the database connection
    async def mock_get_db():
        yield mock_db
    
    # Mock the init_db function
    async def mock_init_db():
        pass
    
    # Mock the FeedbackService.create_feedback_record method
    async def mock_create_feedback_record(*args, **kwargs):
        return None
    
    monkeypatch.setattr("src.database.connection.get_db", mock_get_db)
    monkeypatch.setattr("src.database.connection.init_db", mock_init_db)
    monkeypatch.setattr("src.services.feedback_service.FeedbackService.create_feedback_record", mock_create_feedback_record)