import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch, MagicMock
import os

os.environ["LLM_API_KEY"] = "test_key"
os.environ["TESTING"] = "true"

from src.main import app
from src.services.llm_service import LLMService

client = TestClient(app)

class TestEdgeCases:
    """Test edge cases and error handling scenarios."""
    
    def test_whitespace_only_text(self):
        """Test feedback with only whitespace."""
        response = client.post("/triage", json={"text": "   \n\t   "})
        assert response.status_code == 400
        data = response.json()
        assert "empty or whitespace" in data["message"].lower()
    
    def test_excessive_whitespace_normalization(self):
        """Test that excessive whitespace is normalized."""
        with patch('src.services.llm_service.LLMService.analyze_feedback') as mock_analyze:
            mock_analyze.return_value = {
                "category": "General Inquiry",
                "urgency_score": 2
            }
            
            response = client.post("/triage", json={"text": "  This   has    lots    of   spaces  "})
            
            assert response.status_code == 200
            data = response.json()
            # Check that excessive whitespace was normalized
            assert data["feedback_text"] == "This has lots of spaces"
    
    def test_special_characters_handling(self):
        """Test feedback with special characters."""
        with patch('src.services.llm_service.LLMService.analyze_feedback') as mock_analyze:
            mock_analyze.return_value = {
                "category": "Bug Report",
                "urgency_score": 3
            }
            
            special_text = "Bug with émojis 🐛 and symbols: @#$%^&*()"
            response = client.post("/triage", json={"text": special_text})
            
            assert response.status_code == 200
            data = response.json()
            assert data["feedback_text"] == special_text
    
    @patch('src.services.llm_service.LLMService.analyze_feedback')
    def test_llm_timeout_handling(self, mock_analyze):
        """Test handling of LLM API timeouts."""
        mock_analyze.side_effect = Exception("LLM API request timed out")
        
        response = client.post("/triage", json={"text": "Test feedback"})
        
        assert response.status_code == 500
        data = response.json()
        assert data["error"] == "Internal Server Error"
        assert "try again later" in data["message"]
    
    @patch('src.services.llm_service.LLMService.analyze_feedback')
    def test_malformed_llm_response(self, mock_analyze):
        """Test handling of malformed LLM responses."""
        mock_analyze.side_effect = ValueError("Invalid JSON response from LLM: malformed data")
        
        response = client.post("/triage", json={"text": "Test feedback"})
        
        assert response.status_code == 400
        data = response.json()
        assert data["error"] == "Validation Error"
        assert "Invalid JSON response" in data["message"]


class TestLLMServiceEdgeCases:
    """Test LLM service edge cases."""
    
    def setup_method(self):
        self.llm_service = LLMService()
    
    @pytest.mark.asyncio
    async def test_empty_feedback_text(self):
        """Test analysis with empty feedback text."""
        with pytest.raises(ValueError, match="Feedback text cannot be empty"):
            await self.llm_service.analyze_feedback("")
    
    @pytest.mark.asyncio
    async def test_whitespace_only_feedback(self):
        """Test analysis with whitespace-only feedback."""
        with pytest.raises(ValueError, match="Feedback text cannot be empty"):
            await self.llm_service.analyze_feedback("   \n\t   ")
    
    @pytest.mark.asyncio
    async def test_oversized_feedback(self):
        """Test analysis with oversized feedback."""
        large_text = "x" * 1001
        with pytest.raises(ValueError, match="exceeds maximum length"):
            await self.llm_service.analyze_feedback(large_text)
    
    @pytest.mark.asyncio
    @patch('src.services.llm_service.AsyncOpenAI')
    async def test_empty_llm_response(self, mock_openai):
        """Test handling of empty LLM response."""
        mock_response = MagicMock()
        mock_response.choices = []
        
        mock_client = AsyncMock()
        mock_client.chat.completions.create.return_value = mock_response
        mock_openai.return_value = mock_client
        
        service = LLMService()
        service.client = mock_client
        
        with pytest.raises(ValueError, match="Empty response from LLM"):
            await service.analyze_feedback("Test feedback")
    
    @pytest.mark.asyncio
    @patch('src.services.llm_service.AsyncOpenAI')
    async def test_missing_category_field(self, mock_openai):
        """Test handling of LLM response missing category field."""
        mock_response = MagicMock()
        mock_response.choices[0].message.content = '{"urgency_score": 3}'
        
        mock_client = AsyncMock()
        mock_client.chat.completions.create.return_value = mock_response
        mock_openai.return_value = mock_client
        
        service = LLMService()
        service.client = mock_client
        
        with pytest.raises(ValueError, match="Missing 'category' field"):
            await service.analyze_feedback("Test feedback")
    
    @pytest.mark.asyncio
    @patch('src.services.llm_service.AsyncOpenAI')
    async def test_missing_urgency_field(self, mock_openai):
        """Test handling of LLM response missing urgency field."""
        mock_response = MagicMock()
        mock_response.choices[0].message.content = '{"category": "Bug Report"}'
        
        mock_client = AsyncMock()
        mock_client.chat.completions.create.return_value = mock_response
        mock_openai.return_value = mock_client
        
        service = LLMService()
        service.client = mock_client
        
        with pytest.raises(ValueError, match="Missing 'urgency_score' field"):
            await service.analyze_feedback("Test feedback")
    
    @pytest.mark.asyncio
    @patch('src.services.llm_service.AsyncOpenAI')
    async def test_non_dict_response(self, mock_openai):
        """Test handling of non-dictionary LLM response."""
        mock_response = MagicMock()
        mock_response.choices[0].message.content = '["array", "instead", "of", "object"]'
        
        mock_client = AsyncMock()
        mock_client.chat.completions.create.return_value = mock_response
        mock_openai.return_value = mock_client
        
        service = LLMService()
        service.client = mock_client
        
        with pytest.raises(ValueError, match="LLM response must be a JSON object"):
            await service.analyze_feedback("Test feedback")
    
    @pytest.mark.asyncio
    @patch('src.services.llm_service.AsyncOpenAI')
    async def test_json_extraction_with_extra_text(self, mock_openai):
        """Test JSON extraction when LLM includes extra text."""
        mock_response = MagicMock()
        mock_response.choices[0].message.content = 'Here is the analysis: {"category": "Bug Report", "urgency_score": 4} Hope this helps!'
        
        mock_client = AsyncMock()
        mock_client.chat.completions.create.return_value = mock_response
        mock_openai.return_value = mock_client
        
        service = LLMService()
        service.client = mock_client
        
        result = await service.analyze_feedback("Test feedback")
        assert result["category"] == "Bug Report"
        assert result["urgency_score"] == 4
    
    @pytest.mark.asyncio
    @patch('src.services.llm_service.AsyncOpenAI')
    async def test_string_urgency_score(self, mock_openai):
        """Test handling of string urgency score."""
        mock_response = MagicMock()
        mock_response.choices[0].message.content = '{"category": "Bug Report", "urgency_score": "3"}'
        
        mock_client = AsyncMock()
        mock_client.chat.completions.create.return_value = mock_response
        mock_openai.return_value = mock_client
        
        service = LLMService()
        service.client = mock_client
        
        with pytest.raises(ValueError, match="Invalid urgency score.*Must be an integer"):
            await service.analyze_feedback("Test feedback")

    def test_json_extraction_method(self):
        """Test the JSON extraction helper method."""
        service = LLMService()
        
        # Test with extra text before and after
        text1 = 'Here is the result: {"category": "Bug Report", "urgency_score": 4} Thank you!'
        result1 = service._extract_json_from_response(text1)
        assert result1 == '{"category": "Bug Report", "urgency_score": 4}'
        
        # Test with clean JSON
        text2 = '{"category": "Feature Request", "urgency_score": 2}'
        result2 = service._extract_json_from_response(text2)
        assert result2 == '{"category": "Feature Request", "urgency_score": 2}'
        
        # Test with no JSON braces
        text3 = 'No JSON here'
        result3 = service._extract_json_from_response(text3)
        assert result3 == 'No JSON here'