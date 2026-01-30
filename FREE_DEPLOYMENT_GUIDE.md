# 🆓 Free Deployment Guide - AI-Powered Feedback Triage

Deploy your AI-Powered Feedback Triage application completely **FREE** using Render (backend) and Vercel (frontend).

## 🎯 Quick Overview
- **Frontend**: Vercel (Free tier - Perfect for Next.js)
- **Backend**: Render (Free tier - 512MB RAM, sleeps after 15min inactivity)
- **Database**: SQLite (built-in, no additional cost)
- **Total Cost**: $0.00 per month

## 🚀 Step 1: Deploy Backend on Render (FREE)

### 1.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended)

### 1.2 Deploy Backend
1. Click **"New"** → **"Web Service"**
2. Connect your GitHub repository: `https://github.com/walidBc-blip/ai-feedback-triage`
3. Configure the service:
   - **Name**: `ai-feedback-triage-backend`
   - **Environment**: `Python`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements-prod.txt`
   - **Start Command**: `python -m uvicorn src.main:app --host 0.0.0.0 --port $PORT`

### 1.3 Set Environment Variables on Render
In the Render dashboard, go to Environment and add:
```
OPENAI_API_KEY=your_openai_api_key_here
ENVIRONMENT=production
PORT=10000
```

### 1.4 Deploy
Click **"Create Web Service"** - Render will automatically deploy your backend!

Your backend will be available at: `https://ai-feedback-triage-backend.onrender.com`

## 🌐 Step 2: Deploy Frontend on Vercel (FREE)

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### 2.2 Deploy Frontend
1. Click **"New Project"**
2. Import your GitHub repository: `ai-feedback-triage`
3. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 2.3 Set Environment Variables on Vercel
In the Vercel dashboard, go to Settings → Environment Variables and add:
```
NEXT_PUBLIC_API_URL=https://ai-feedback-triage-backend.onrender.com
```

### 2.4 Deploy
Click **"Deploy"** - Vercel will build and deploy your frontend!

Your frontend will be available at: `https://ai-feedback-triage.vercel.app`

## ✅ Step 3: Test Your Deployment

1. **Visit your frontend URL**: `https://ai-feedback-triage.vercel.app`
2. **Test feedback submission**: Enter some feedback and submit
3. **Check dashboard**: Go to `/dashboard` to see analytics
4. **Verify backend**: Visit `https://ai-feedback-triage-backend.onrender.com/docs` for API docs

## 🔧 Important Notes

### Render Free Tier Limitations
- **512MB RAM** (sufficient for our app)
- **Sleeps after 15 minutes** of inactivity (cold starts ~30 seconds)
- **750 hours/month** (basically unlimited)

### Vercel Free Tier Limitations
- **100GB bandwidth/month** (very generous)
- **Unlimited deployments**
- **Custom domains** supported on free tier

### Cold Starts
- First request after sleep might take 30 seconds
- Subsequent requests are fast
- This is normal for free hosting

## 🛠️ Troubleshooting

### Backend Issues
1. **Check Render logs** in the dashboard
2. **Verify environment variables** are set correctly
3. **Ensure OPENAI_API_KEY** is valid

### Frontend Issues
1. **Check Vercel logs** in the dashboard
2. **Verify NEXT_PUBLIC_API_URL** points to your Render backend
3. **Check browser console** for CORS errors

### Common Fixes
1. **CORS errors**: Backend automatically allows all origins in production
2. **API not found**: Ensure backend URL ends without trailing slash
3. **Cold start delays**: Wait 30 seconds for first request after sleep

## 🔄 Automatic Deployments

Both platforms automatically redeploy when you push to GitHub:
- **Render**: Deploys `main` branch automatically
- **Vercel**: Deploys `main` branch automatically

## 📊 Monitoring

### Render
- View logs and metrics in dashboard
- Monitor uptime and performance
- Set up health checks

### Vercel
- View analytics and performance
- Monitor function execution times
- Check deployment status

## 🎉 You're Live!

Your AI-Powered Feedback Triage System is now deployed for FREE:

- **🌐 Frontend**: https://ai-feedback-triage.vercel.app
- **⚡ Backend**: https://ai-feedback-triage-backend.onrender.com
- **📚 API Docs**: https://ai-feedback-triage-backend.onrender.com/docs
- **📊 Dashboard**: https://ai-feedback-triage.vercel.app/dashboard

## 💡 Pro Tips

1. **Bookmark your URLs** for easy access
2. **Keep backend "warm"** by visiting it every 10 minutes (use uptimerobot.com)
3. **Monitor usage** to stay within free tier limits
4. **Use custom domain** on Vercel for professional look

## 🚀 Future Upgrades

When you're ready to scale:
- **Render**: Upgrade to $7/month for always-on service
- **Vercel**: Pro plan at $20/month for advanced features
- **Database**: Add PostgreSQL when you need shared data

---

**Enjoy your FREE AI-powered application! 🎉**