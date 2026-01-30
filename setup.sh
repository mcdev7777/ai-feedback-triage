#!/bin/bash

echo "🚀 Setting up AI-Powered Feedback Triage Application"
echo "=================================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and add your LLM_API_KEY before continuing"
    echo "   Example: LLM_API_KEY=sk-your-openai-api-key-here"
    echo ""
    read -p "Press Enter after you've added your API key to continue..."
fi

# Validate that API key is set
if ! grep -q "LLM_API_KEY=sk-" .env 2>/dev/null && ! grep -q "LLM_API_KEY=.*" .env | grep -v "your_openai_api_key_here" 2>/dev/null; then
    echo "❌ Please set a valid LLM_API_KEY in the .env file"
    exit 1
fi

echo "🐳 Building and starting the application with Docker..."
docker-compose up --build

echo "✅ Application should now be running at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"