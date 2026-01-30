# 🚀 Complete Deployment Guide for AI-Powered Feedback Triage

## Overview
This guide will help you deploy your AI-Powered Feedback Triage application using:
- **Frontend**: Vercel (Next.js hosting)
- **Backend**: Railway (FastAPI + PostgreSQL)
- **Database**: PostgreSQL (Railway managed)

## Prerequisites

### 1. Install Required Tools
```bash
# Install Vercel CLI
npm install -g vercel

# Install Railway CLI
npm install -g @railway/cli
```

### 2. Create Accounts
- **Vercel Account**: https://vercel.com/signup
- **Railway Account**: https://railway.app/login

## Step 1: Deploy Backend on Railway

### 1.1 Initialize Railway Project
```bash
cd backend
railway login
railway init
```

### 1.2 Add PostgreSQL Database
```bash
railway add postgresql
```

### 1.3 Set Environment Variables
```bash
# Set your OpenAI API key
railway variables set OPENAI_API_KEY=your_openai_api_key_here

# Set database configuration (Railway will auto-configure DATABASE_URL)
railway variables set ENVIRONMENT=production
railway variables set PORT=8000
```

### 1.4 Deploy Backend
```bash
railway up
```

## Step 2: Deploy Frontend on Vercel

### 2.1 Initialize Vercel Project
```bash
cd frontend
vercel login
vercel
```

### 2.2 Configure Environment Variables
After the first deployment, go to your Vercel dashboard and add:
- `NEXT_PUBLIC_API_URL`: Your Railway backend URL (e.g., `https://your-app-name.railway.app`)

### 2.3 Redeploy Frontend
```bash
vercel --prod
```

## Step 3: Environment Variables Setup

### Backend Environment Variables (Railway)
- `OPENAI_API_KEY`: Your OpenAI API key
- `DATABASE_URL`: Auto-configured by Railway
- `ENVIRONMENT`: `production`
- `PORT`: `8000`

### Frontend Environment Variables (Vercel)
- `NEXT_PUBLIC_API_URL`: Your Railway backend URL

## Step 4: Database Migration

### 4.1 Connect to Railway Database
```bash
railway connect postgresql
```

### 4.2 Run Database Migrations
```bash
cd backend
railway run alembic upgrade head
```

## Step 5: Testing Your Deployment

1. **Backend Health Check**: Visit `https://your-railway-app.railway.app/health`
2. **Frontend**: Visit your Vercel URL
3. **Full Integration**: Test feedback submission and dashboard

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend allows your frontend domain
2. **API Connection**: Check `NEXT_PUBLIC_API_URL` is correct
3. **Database Connection**: Verify `DATABASE_URL` is properly set
4. **OpenAI API**: Ensure `OPENAI_API_KEY` is valid

### Logs
- **Railway**: `railway logs`
- **Vercel**: Check Function logs in Vercel dashboard

## Alternative: Deploy Backend on Render

If you prefer Render over Railway:

### 1. Create Render Account
Go to https://render.com/

### 2. Create Web Service
- Connect your GitHub repository
- Root directory: `backend`
- Build command: `pip install -r requirements-prod.txt`
- Start command: `python -m uvicorn src.main:app --host 0.0.0.0 --port $PORT`

### 3. Add PostgreSQL Database
- Create a PostgreSQL database on Render
- Connect to your web service

### 4. Environment Variables
Add the same environment variables as Railway

## Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **CORS**: Configure proper CORS settings for production
3. **HTTPS**: Both platforms provide HTTPS by default
4. **Rate Limiting**: Consider adding rate limiting for production

## Monitoring

- **Railway**: Built-in monitoring dashboard
- **Vercel**: Analytics and performance monitoring
- **Uptime**: Consider adding uptime monitoring (e.g., UptimeRobot)

## Scaling

- **Railway**: Auto-scaling available
- **Vercel**: Automatic scaling for frontend
- **Database**: Monitor and scale database as needed

## Cost Optimization

- **Railway**: $5/month for starter plan
- **Vercel**: Free tier available, Pro at $20/month
- **Database**: Monitor usage and optimize queries

## Next Steps

1. Set up monitoring and alerting
2. Configure custom domain
3. Add analytics tracking
4. Set up CI/CD pipeline
5. Add backup strategies

## Support

- **Railway**: https://railway.app/help
- **Vercel**: https://vercel.com/help
- **Next.js**: https://nextjs.org/docs

---

**Your application is now ready for production! 🎉**