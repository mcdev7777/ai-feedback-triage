import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
import os

os.environ["LLM_API_KEY"] = "test_key"
os.environ["TESTING"] = "true"

from src.main import app

client = TestClient(app)

class TestTriageEndpoint:
    def test_root_endpoint(self):
        response = client.get("/")
        assert response.status_code == 200
        assert response.json()["message"] == "AI-Powered Feedback Triage API"
    
    def test_health_endpoint(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
    
    @patch('src.services.llm_service.LLMService.analyze_feedback')
    def test_triage_success(self, mock_analyze):
        mock_analyze.return_value = {
            "category": "Bug Report",
            "urgency_score": 4
        }
        
        response = client.post("/triage", json={"text": "Login is broken"})
        
        assert response.status_code == 200
        data = response.json()
        assert data["feedback_text"] == "Login is broken"
        assert data["category"] == "Bug Report"
        assert data["urgency_score"] == 4
    
    def test_triage_empty_text(self):
        response = client.post("/triage", json={"text": ""})
        assert response.status_code == 422
    
    def test_triage_long_text(self):
        long_text = "x" * 1001
        response = client.post("/triage", json={"text": long_text})
        assert response.status_code == 422
    
    def test_triage_missing_text(self):
        response = client.post("/triage", json={})
        assert response.status_code == 422
    
    @patch('src.services.llm_service.LLMService.analyze_feedback')
    def test_triage_llm_error(self, mock_analyze):
        mock_analyze.side_effect = Exception("LLM API error")
        
        response = client.post("/triage", json={"text": "Test feedback"})
        
        assert response.status_code == 500
        data = response.json()
        assert data["error"] == "Internal Server Error"
        assert data["status_code"] == 500
    
    @patch('src.services.llm_service.LLMService.analyze_feedback')
    def test_triage_validation_error(self, mock_analyze):
        mock_analyze.side_effect = ValueError("Invalid category")
        
        response = client.post("/triage", json={"text": "Test feedback"})
        
        assert response.status_code == 400
        data = response.json()
        assert data["error"] == "Validation Error"
        assert data["status_code"] == 400