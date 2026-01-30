# 🤖 AI-Powered Feedback Triage System

A comprehensive, modern system for automatically classifying and prioritizing user feedback using AI. Built with cutting-edge technologies and featuring a stunning, responsive interface with glass morphism effects and advanced analytics.

![AI Feedback Triage](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge&logo=openai)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🌟 Live Demo (FREE Hosting!)
- **🌐 Frontend**: [https://ai-feedback-triage.vercel.app](https://ai-feedback-triage.vercel.app)
- **📊 Dashboard**: [https://ai-feedback-triage.vercel.app/dashboard](https://ai-feedback-triage.vercel.app/dashboard)
- **⚡ Backend API**: [https://ai-feedback-triage-backend.onrender.com](https://ai-feedback-triage-backend.onrender.com)
- **📚 API Docs**: [https://ai-feedback-triage-backend.onrender.com/docs](https://ai-feedback-triage-backend.onrender.com/docs)

## ✨ Features

### Core Functionality
- 🤖 **AI-powered feedback classification** into 4 categories with improved accuracy
- ⚡ **Real-time urgency scoring** (1-5 scale) with few-shot learning
- 🔄 **Clean, responsive web interface** with modern design
- 🐳 **Fully containerized** with Docker for easy deployment

### 📊 Analytics Dashboard
- **Beautiful data visualizations** with charts and graphs
- **Real-time statistics** and performance metrics
- **Feedback history** with search and filtering
- **Category and urgency distribution** analysis
- **Daily trends** and processing time analytics
- **Responsive design** that works on all devices

### 🛡️ Production Features
- ✅ **Comprehensive error handling** and validation
- 🔒 **Rate limiting** and security features  
- 🗄️ **Database integration** (SQLite/PostgreSQL) for persistent storage
- 🧪 **Extensive unit tests** with 30+ test cases
- 📈 **Performance monitoring** and logging
- 🌐 **Cloud deployment ready** with multiple platform configurations

## Categories

The system classifies feedback into these categories:
- **Bug Report**: Technical issues or broken functionality
- **Feature Request**: Suggestions for new features or enhancements
- **Praise/Positive Feedback**: Satisfaction or appreciation
- **General Inquiry**: Questions or comments

## Urgency Scale

- **1**: Not Urgent
- **2**: Low
- **3**: Medium
- **4**: High
- **5**: Critical

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- OpenAI API key (or other LLM provider API key)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-feedback-triage
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your API credentials:
   ```env
   LLM_API_KEY=your_openai_api_key_here
   LLM_MODEL=o4-mini-2025-04-16
   # LLM_BASE_URL=  # Optional: for custom API endpoints
   # DATABASE_URL=  # Optional: PostgreSQL connection string
   ```

3. **Run the application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - 🏠 **Frontend**: http://localhost:3000
   - 📊 **Dashboard**: http://localhost:3000/dashboard
   - 🔧 **Backend API**: http://localhost:8000
   - 📚 **API Documentation**: http://localhost:8000/docs

## 🆓 Free Deployment (Recommended)

Deploy your application **completely FREE** using Render + Vercel:

### 🚀 Quick Deploy (5 minutes)

1. **Backend on Render (Free Tier)**:
   - Visit [render.com](https://render.com) → New Web Service
   - Connect your GitHub repo: `ai-feedback-triage`
   - Root Directory: `backend`
   - Build: `pip install -r requirements-prod.txt`
   - Start: `python -m uvicorn src.main:app --host 0.0.0.0 --port $PORT`
   - Environment: `OPENAI_API_KEY=your_key`

2. **Frontend on Vercel (Free Tier)**:
   - Visit [vercel.com](https://vercel.com) → New Project
   - Import your GitHub repo: `ai-feedback-triage`
   - Root Directory: `frontend`
   - Environment: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`

### 💰 Cost: $0.00/month
- **Render Free**: 512MB RAM, sleeps after 15min (perfect for demos)
- **Vercel Free**: 100GB bandwidth, unlimited deployments
- **Database**: SQLite included, no additional cost

📋 **Detailed Guide**: See [FREE_DEPLOYMENT_GUIDE.md](./FREE_DEPLOYMENT_GUIDE.md)

## 📊 Dashboard Features

The analytics dashboard provides comprehensive insights into your feedback data:

### Real-time Statistics
- **Total feedback count** over customizable time periods
- **Urgent items tracking** (High & Critical priority)
- **Average processing time** for performance monitoring
- **Daily submission rates** and trends

### Data Visualizations
- **Pie charts** for category distribution
- **Bar charts** for urgency level analysis
- **Line graphs** for daily feedback trends
- **Interactive filtering** by category, urgency, and date range

### Feedback Management
- **Search functionality** to find specific feedback
- **Advanced filtering** by category, urgency level, and timeframe
- **Detailed history view** with metadata (processing time, IP, timestamps)
- **Export capabilities** for further analysis

### Performance Analytics
- **Processing time metrics** to monitor API performance
- **Database query optimization** with indexed searches
- **Real-time updates** without page refresh

## API Documentation

### POST /triage

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

### GET /health

Returns application health status.

### Dashboard API Endpoints

#### GET /dashboard/stats

Returns dashboard statistics and analytics.

**Query Parameters:**
- `days_back` (integer, optional): Number of days to look back (default: 30, max: 365)

**Response (200 OK):**
```json
{
  "total_feedback": 150,
  "urgent_items": 12,
  "avg_processing_time": 2.3,
  "daily_average": 5.0
}
```

#### GET /dashboard/history

Returns paginated feedback history with filtering capabilities.

**Query Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 50, max: 100)
- `category` (string, optional): Filter by category
- `urgency` (integer, optional): Filter by urgency level
- `search` (string, optional): Search in feedback text
- `start_date` (string, optional): Start date filter (ISO format)
- `end_date` (string, optional): End date filter (ISO format)

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": 1,
      "feedback_text": "Login issue with password reset",
      "category": "Bug Report",
      "urgency_score": 4,
      "processing_time": 2.1,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 50,
  "total_pages": 3
}
```

#### GET /dashboard/trends

Returns daily feedback trends and category distribution.

**Query Parameters:**
- `days` (integer, optional): Number of days to analyze (default: 30)

**Response (200 OK):**
```json
{
  "daily_trends": [
    {"date": "2024-01-15", "count": 8},
    {"date": "2024-01-16", "count": 12}
  ],
  "category_distribution": [
    {"category": "Bug Report", "count": 45},
    {"category": "Feature Request", "count": 30}
  ],
  "urgency_distribution": [
    {"urgency": 1, "count": 20},
    {"urgency": 2, "count": 35}
  ]
}

## Development

### Backend Development

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set environment variables**
   ```bash
   export LLM_API_KEY=your_api_key
   export LLM_MODEL=o4-mini-2025-04-16
   ```

4. **Run the backend**
   ```bash
   python -m uvicorn src.main:app --reload
   ```

5. **Run tests**
   ```bash
   pytest
   ```

### Frontend Development

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables**
   ```bash
   echo "API_URL=http://localhost:8000" > .env.local
   ```

4. **Run the frontend**
   ```bash
   npm run dev
   ```

## Architecture

### Backend (FastAPI)
- **FastAPI**: Modern Python web framework with async support
- **SQLAlchemy**: Async ORM for database operations
- **Alembic**: Database migration management
- **Pydantic**: Data validation and serialization
- **OpenAI Client**: LLM integration with few-shot learning
- **aioSQLite**: Async SQLite driver
- **Pytest**: Comprehensive testing framework

### Frontend (Next.js/React)
- **Next.js**: React framework with SSR capabilities
- **TypeScript**: Type-safe JavaScript development
- **Recharts**: Beautiful data visualization library
- **Lucide React**: Modern icon components
- **date-fns**: Date manipulation utilities
- **Axios**: HTTP client for API calls
- **CSS Modules**: Scoped styling with responsive design

### Database
- **SQLite**: Default file-based database for development
- **PostgreSQL**: Production-ready database option
- **Indexed queries**: Optimized search and filtering
- **Migration system**: Version-controlled schema changes

### Deployment & Infrastructure
- **Docker**: Containerization with multi-stage builds
- **Docker Compose**: Multi-service orchestration
- **Nginx**: Reverse proxy with rate limiting and security headers
- **Free hosting**: Render (backend) + Vercel (frontend) = $0/month
- **Cloud platforms**: Render, Vercel, AWS, Google Cloud support

## Design Choices

### Technology Stack
- **FastAPI** was chosen for its excellent async support, automatic API documentation, and built-in data validation
- **Next.js** provides excellent developer experience with React and built-in optimization features
- **Docker** ensures consistent deployment across environments

### AI Integration
- **OpenAI GPT-4** provides reliable classification with few-shot learning
- **Enhanced prompting** with real examples improves accuracy and consistency
- **Structured prompting** ensures consistent JSON responses
- **Response validation** prevents malformed data from reaching users
- **Timeout handling** and retry logic for robust LLM integration

### Database Design
- **SQLite default** for simplicity and zero-configuration setup
- **PostgreSQL support** for production scalability and performance
- **Async operations** throughout the stack for better concurrency
- **Indexed columns** on frequently queried fields (category, urgency, timestamps)
- **Migration system** ensures reliable schema evolution

### Analytics & Visualization
- **Recharts library** chosen for responsive, interactive charts
- **Real-time updates** without page refresh for better UX
- **Flexible filtering** enables detailed analysis and insights
- **Performance optimization** with pagination and efficient queries

### Error Handling
- **Comprehensive validation** at API and database layers
- **Graceful degradation** with meaningful error messages
- **Rate limiting** prevents abuse and manages costs
- **Database connection pooling** for reliability under load

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| LLM_API_KEY | API key for LLM provider | - | Yes |
| LLM_MODEL | Model name (e.g., o4-mini-2025-04-16, gpt-4) | o4-mini-2025-04-16 | No |
| LLM_BASE_URL | Custom API endpoint URL | - | No |
| DATABASE_URL | Database connection string | sqlite+aiosqlite:///./feedback_triage.db | No |
| SQL_DEBUG | Enable SQL query logging | false | No |
| API_URL | Backend URL for frontend | http://localhost:8000 | No |

## Testing

### Backend Tests
```bash
cd backend
pytest
```

Tests cover:
- API endpoint functionality
- LLM service integration
- Error handling scenarios
- Input validation

### Frontend Tests
```bash
cd frontend
npm test
```

## Troubleshooting

### Common Issues

**1. "LLM_API_KEY environment variable is required"**
- Solution: Ensure you've set the LLM_API_KEY in your .env file

**2. "Network error occurred"**
- Solution: Check that the backend is running and accessible
- Verify API_URL environment variable is correct

**3. "LLM API request timed out"**
- Solution: Check your internet connection and API key validity
- The default timeout is 30 seconds

**4. Docker build fails**
- Solution: Ensure Docker is running and you have sufficient disk space
- Try: `docker system prune` to clean up space

**5. Frontend can't connect to backend**
- Solution: Verify both services are running
- Check docker-compose logs: `docker-compose logs`

### Debugging

1. **Check application logs**
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   ```

2. **Verify services are running**
   ```bash
   docker-compose ps
   ```

3. **Test backend directly**
   ```bash
   curl -X POST http://localhost:8000/triage \
     -H "Content-Type: application/json" \
     -d '{"text": "Test feedback"}'
   ```

## Performance Considerations

- **API Rate Limits**: The application handles OpenAI rate limits gracefully
- **Timeouts**: 30-second timeout for LLM requests prevents hanging
- **Input Validation**: 1000 character limit prevents excessive API costs
- **Error Caching**: Failed requests don't retry immediately

## Security

- **Environment Variables**: Sensitive data is stored in environment variables
- **Input Sanitization**: All user input is validated and sanitized
- **CORS**: Configured for development and production environments
- **No API Key Exposure**: API keys are never sent to the frontend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License.