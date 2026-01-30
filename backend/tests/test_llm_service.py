import pytest
import pytest_asyncio
from unittest.mock import AsyncMock, patch, MagicMock
import json
import os
import sys
from pathlib import Path

# Add backend/src to path for imports
backend_src = Path(__file__).parent.parent / "src"
sys.path.insert(0, str(backend_src))

os.environ["LLM_API_KEY"] = "test_key"
os.environ["TESTING"] = "true"

from services.llm_service import LLMService

class TestLLMService:
    def setup_method(self):
        self.llm_service = LLMService()
    
    def test_init_with_missing_api_key(self):
        with patch.dict(os.environ, {}, clear=True):
            with pytest.raises(ValueError, match="LLM_API_KEY environment variable is required"):
                LLMService()
    
    def test_create_prompt(self):
        feedback = "Test feedback"
        prompt = self.llm_service._create_prompt(feedback)
        
        assert "Test feedback" in prompt
        assert "Bug Report" in prompt
        assert "urgency_score" in prompt
        assert "JSON" in prompt
    
    @pytest.mark.asyncio
    @patch('services.llm_service.AsyncOpenAI')
    async def test_analyze_feedback_success(self, mock_openai):
        mock_response = MagicMock()
        mock_response.choices[0].message.content = '{"category": "Bug Report", "urgency_score": 4}'
        
        mock_client = AsyncMock()
        mock_client.chat.completions.create.return_value = mock_response
        mock_openai.return_value = mock_client
        
        service = LLMService()
        service.client = mock_client
        
        result = await service.analyze_feedback("Login is broken")
        
        assert result["category"] == "Bug Report"
        assert result["urgency_score"] == 4
    
    @pytest.mark.asyncio
    @patch('services.llm_service.AsyncOpenAI')
    async def test_analyze_feedback_invalid_json(self, mock_openai):
        mock_response = MagicMock()
        mock_response.choices[0].message.content = 'Invalid JSON'
        
        mock_client = AsyncMock()
        mock_client.chat.completions.create.return_value = mock_response
        mock_openai.return_value = mock_client
        
        service = LLMService()
        service.client = mock_client
        
        with pytest.raises(ValueError, match="Invalid JSON response from LLM"):
            await service.analyze_feedback("Test feedback")
    
    @pytest.mark.asyncio
    @patch('services.llm_service.AsyncOpenAI')
    async def test_analyze_feedback_invalid_category(self, mock_openai):
        mock_response = MagicMock()
        mock_response.choices[0].message.content = '{"category": "Invalid Category", "urgency_score": 4}'
        
        mock_client = AsyncMock()
        mock_client.chat.completions.create.return_value = mock_response
        mock_openai.return_value = mock_client
        
        service = LLMService()
        service.client = mock_client
        
        with pytest.raises(ValueError, match="Invalid category"):
            await service.analyze_feedback("Test feedback")
    
    @pytest.mark.asyncio
    @patch('services.llm_service.AsyncOpenAI')
    async def test_analyze_feedback_invalid_urgency(self, mock_openai):
        mock_response = MagicMock()
        mock_response.choices[0].message.content = '{"category": "Bug Report", "urgency_score": 6}'
        
        mock_client = AsyncMock()
        mock_client.chat.completions.create.return_value = mock_response
        mock_openai.return_value = mock_client
        
        service = LLMService()
        service.client = mock_client
        
        with pytest.raises(ValueError, match="Invalid urgency score"):
            await service.analyze_feedback("Test feedback")