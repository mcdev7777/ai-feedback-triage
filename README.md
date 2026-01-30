# AI-Powered Feedback Triage System

A comprehensive web application that automatically classifies and prioritizes user feedback using AI. Built with FastAPI backend, Next.js frontend, and Docker for streamlined deployment.

![CI](https://github.com/walidBc-blip/ai-feedback-triage/workflows/Continuous%20Integration/badge.svg)
![AI Feedback Triage](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge&logo=openai)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## 🌟 Live Demo
- **Frontend**: [https://ai-feedback-triage.vercel.app](https://ai-feedback-triage.vercel.app)
- **API Documentation**: [https://ai-feedback-triage-backend.onrender.com/docs](https://ai-feedback-triage-backend.onrender.com/docs)
- **Dashboard**: [https://ai-feedback-triage.vercel.app/dashboard](https://ai-feedback-triage.vercel.app/dashboard)

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- OpenAI API key

### Setup & Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/walidBc-blip/ai-feedback-triage.git
   cd ai-feedback-triage
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your API credentials:
   ```env
   LLM_API_KEY=your_openai_api_key_here
   LLM_MODEL=o4-mini-2025-04-16
   API_URL=http://localhost:8000
   ```

3. **Run the application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs
   - **Dashboard**: http://localhost:3000/dashboard

## 📊 Core Features

### Feedback Classification
The system classifies feedback into four categories:
- **Bug Report**: Technical issues or broken functionality
- **Feature Request**: Suggestions for new features or enhancements  
- **Praise/Positive Feedback**: Satisfaction or appreciation
- **General Inquiry**: Questions or comments

### Urgency Scoring
AI assigns urgency scores on a 1-5 scale:
- **1**: Not Urgent
- **2**: Low
- **3**: Medium
- **4**: High
- **5**: Critical

### Analytics Dashboard
- Real-time statistics and performance metrics
- Interactive data visualizations with charts
- Feedback history with search and filtering capabilities
- Category and urgency distribution analysis
- Daily trends and processing time analytics

## 🔧 API Documentation

### Core Endpoint

#### POST /triage
Analyzes feedback text and returns classification and urgency score.

**Request:**
```json
{
  "text": "I can't log in to my account, the password reset link is broken!"
}
```

**Response (200 OK):**
```json
{
  "feedback_text": "I can't log in to my account, the password reset link is broken!",
  "category": "Bug Report", 
  "urgency_score": 4
}
```

**Error Response (400/500):**
```json
{
  "error": "Validation Error",
  "message": "Feedback text must be 1000 characters or less",
  "status_code": 400
}
```

### Additional Endpoints

- **GET /health** - Application health check
- **GET /docs** - Interactive API documentation
- **GET /api/dashboard/stats** - Dashboard statistics
- **GET /api/dashboard/feedback** - Feedback history with pagination

## 🏗️ Architecture

### Backend (FastAPI)
- **FastAPI**: Modern Python web framework with async support
- **SQLAlchemy**: Async ORM for database operations
- **OpenAI Integration**: AI-powered feedback classification using o4-mini model
- **SQLite**: Lightweight database for development and testing
- **Comprehensive Testing**: Unit tests with pytest and async support

### Frontend (Next.js)
- **Next.js 14**: React framework with server-side rendering
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern styling with responsive design
- **Recharts**: Interactive data visualization
- **Real-time Updates**: Dynamic dashboard with live data

### Deployment
- **Docker**: Containerized application with multi-stage builds
- **Docker Compose**: Single-command deployment
- **Cloud Ready**: Deployed on Vercel (frontend) and Render (backend)

## 🧪 Testing

Run the test suite:

```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests (if available)
cd frontend
npm test
```

Test coverage includes:
- API endpoint functionality
- LLM service integration
- Error handling scenarios
- Input validation
- Edge cases and rate limiting

## 🔒 Security & Performance

### Security Features
- Input validation and sanitization
- API key management through environment variables
- CORS configuration for cross-origin requests
- Rate limiting for API endpoints

### Performance Considerations
- 30-second timeout for LLM API calls
- Input length validation (max 1000 characters)
- Async/await throughout the stack
- Efficient database queries with SQLAlchemy

## 🛠️ Development

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn src.main:app --reload
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## 📋 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| LLM_API_KEY | OpenAI API key | - | Yes |
| LLM_MODEL | Model name | o4-mini-2025-04-16 | No |
| LLM_BASE_URL | Custom API endpoint | - | No |
| API_URL | Backend URL for frontend | http://localhost:8000 | No |

## 🎯 Design Choices

### Technology Stack
- **FastAPI** chosen for excellent async support, automatic API documentation, and built-in data validation
- **Next.js** provides superior developer experience with React and built-in optimization features
- **Docker** ensures consistent deployment across different environments
- **SQLite** offers simplicity and zero-configuration setup for development

### AI Integration
- **OpenAI o4-mini** model provides reliable classification with cost efficiency
- **Few-shot learning** with examples in prompts improves accuracy and consistency
- **Structured prompting** ensures consistent JSON responses
- **Robust error handling** with timeout management and retry logic

## 🐛 Troubleshooting

### Common Issues

**"LLM_API_KEY environment variable is required"**
- Ensure you've set the LLM_API_KEY in your .env file

**"Network error occurred"**
- Check that the backend is running and accessible
- Verify API_URL environment variable is correct

**"LLM API request timed out"**
- Check your internet connection and API key validity
- Default timeout is 30 seconds

**Docker build fails**
- Ensure Docker is running and you have sufficient disk space
- Try: `docker system prune` to clean up space

### Debugging
```bash
# Check application logs
docker-compose logs backend
docker-compose logs frontend

# Verify services are running
docker-compose ps

# Test backend directly
curl -X POST http://localhost:8000/triage \
  -H "Content-Type: application/json" \
  -d '{"text": "Test feedback"}'
```

## 📁 Project Structure

```
ai-feedback-triage/
├── backend/                 # FastAPI backend
│   ├── src/
│   │   ├── api/            # API route handlers
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic (LLM, feedback)
│   │   ├── database/       # Database connection and setup
│   │   └── main.py         # FastAPI application entry point
│   ├── tests/              # Backend test suite
│   ├── Dockerfile          # Backend container configuration
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Next.js pages
│   │   ├── utils/          # Utility functions and API calls
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   ├── Dockerfile          # Frontend container configuration
│   └── package.json        # Node.js dependencies
├── docker-compose.yml      # Multi-service orchestration
├── .env.example            # Environment variables template
└── README.md              # Project documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
