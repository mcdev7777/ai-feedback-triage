#!/usr/bin/env python3
"""
Simple validation script to ensure all required files are present
"""
import os
import sys
from pathlib import Path

def check_file_exists(filepath, description):
    """Check if a file exists and print status"""
    if os.path.exists(filepath):
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description}: {filepath} - MISSING")
        return False

def main():
    print("🔍 Validating AI-Powered Feedback Triage Project Structure\n")
    
    all_files_present = True
    
    # Core configuration files
    files_to_check = [
        ("README.md", "Main documentation"),
        (".env.example", "Environment variables template"),
        (".gitignore", "Git ignore file"),
        ("docker-compose.yml", "Docker compose configuration"),
        
        # Backend files
        ("backend/Dockerfile", "Backend Dockerfile"),
        ("backend/requirements.txt", "Backend dependencies"),
        ("backend/src/main.py", "Backend main application"),
        ("backend/src/api/triage.py", "Triage API endpoint"),
        ("backend/src/services/llm_service.py", "LLM service"),
        ("backend/src/models/triage.py", "Data models"),
        ("backend/tests/test_triage.py", "Triage tests"),
        ("backend/tests/test_llm_service.py", "LLM service tests"),
        
        # Frontend files
        ("frontend/Dockerfile", "Frontend Dockerfile"),
        ("frontend/package.json", "Frontend dependencies"),
        ("frontend/next.config.js", "Next.js configuration"),
        ("frontend/tsconfig.json", "TypeScript configuration"),
        ("frontend/src/pages/index.tsx", "Main page"),
        ("frontend/src/components/FeedbackForm.tsx", "Feedback form component"),
        ("frontend/src/components/ResultDisplay.tsx", "Result display component"),
        ("frontend/src/components/ErrorDisplay.tsx", "Error display component"),
        ("frontend/src/utils/api.ts", "API utilities"),
        ("frontend/src/types/index.ts", "Type definitions"),
        ("frontend/src/styles/globals.css", "Global styles"),
    ]
    
    for filepath, description in files_to_check:
        if not check_file_exists(filepath, description):
            all_files_present = False
    
    print(f"\n{'='*60}")
    if all_files_present:
        print("🎉 All required files are present!")
        print("🚀 Project is ready for deployment!")
        print("\nNext steps:")
        print("1. Copy .env.example to .env and add your LLM_API_KEY")
        print("2. Run: docker-compose up --build")
        print("3. Access the application at http://localhost:3000")
    else:
        print("❌ Some files are missing. Please check the output above.")
        sys.exit(1)

if __name__ == "__main__":
    main()