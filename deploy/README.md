# Deployment Guide

This directory contains deployment configurations for various cloud platforms.

## Quick Deploy Options

### 1. Railway.app (Recommended for simplicity)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### 2. Render.com
```bash
# Connect your GitHub repo to Render
# Create a new Web Service
# Use the following build command: docker-compose up --build
```

### 3. AWS ECS with Fargate
```bash
# Use the provided ecs-task-definition.json
aws ecs register-task-definition --cli-input-json file://deploy/aws/ecs-task-definition.json
```

### 4. Google Cloud Run
```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/feedback-triage
gcloud run deploy --image gcr.io/PROJECT_ID/feedback-triage --platform managed
```

### 5. Vercel (Frontend only) + Railway (Backend)
```bash
# Deploy frontend to Vercel
vercel --prod

# Deploy backend to Railway
railway init
railway up
```

## Environment Variables for Production

Required environment variables:
- `LLM_API_KEY`: Your OpenAI API key
- `LLM_MODEL`: Model name (e.g., "gpt-4")
- `DATABASE_URL`: Database connection string (optional, defaults to SQLite)
- `API_URL`: Backend URL for frontend

## Database Options

### SQLite (Default)
- File-based database
- No additional setup required
- Good for development and small-scale production

### PostgreSQL (Recommended for production)
```bash
# Set DATABASE_URL to PostgreSQL connection string
DATABASE_URL=postgresql+asyncpg://user:password@host:port/dbname
```

### Supported cloud databases:
- AWS RDS PostgreSQL
- Google Cloud SQL
- Azure Database for PostgreSQL
- Supabase
- PlanetScale (MySQL)

## SSL/HTTPS Setup

For production deployment with custom domain:
1. Obtain SSL certificate (Let's Encrypt recommended)
2. Update nginx.conf with your domain and certificate paths
3. Uncomment HTTPS server block in nginx.conf

## Monitoring and Logs

The application includes:
- Health check endpoints (`/health`)
- Structured logging
- Performance metrics (processing times)
- Error tracking

Recommended monitoring tools:
- Application: Sentry, DataDog, New Relic
- Infrastructure: AWS CloudWatch, Google Cloud Monitoring
- Uptime: Pingdom, UptimeRobot

## Scaling Considerations

- Frontend: CDN deployment (Vercel, Netlify, CloudFlare)
- Backend: Horizontal scaling with load balancer
- Database: Read replicas for high traffic
- LLM API: Rate limiting and caching for cost optimization