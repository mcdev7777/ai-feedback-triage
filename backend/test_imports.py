#!/usr/bin/env python3
"""Test script to verify imports work correctly."""

import sys
import os
from pathlib import Path

# Add backend/src to path for imports
backend_src = Path(__file__).parent / "src"
sys.path.insert(0, str(backend_src))

# Set environment variables
os.environ["LLM_API_KEY"] = "test_key"
os.environ["TESTING"] = "true"

try:
    # Test main imports
    from main import app
    print("✓ main.app imported successfully")
    
    from services.llm_service import LLMService
    print("✓ services.llm_service imported successfully")
    
    from api.triage import clear_rate_limits
    print("✓ api.triage imported successfully")
    
    # Test LLMService initialization
    llm_service = LLMService()
    print("✓ LLMService initialized successfully")
    
    print("\nAll imports working correctly!")
    
except Exception as e:
    print(f"✗ Import error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)