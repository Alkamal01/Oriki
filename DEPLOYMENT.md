# 🚀 Deployment Guide

This guide covers deploying Oríkì with the frontend on Vercel and backend on Render.

---

## 📋 Prerequisites

- GitHub account
- Vercel account ([vercel.com](https://vercel.com))
- Render account ([render.com](https://render.com))
- API keys (ASI Cloud, OpenAI, Tavily, Fetch.ai)

---

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Your Repository

Ensure your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

   **Settings:**
   - **Name**: `oriki-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend` (IMPORTANT!)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   
   **⚠️ CRITICAL**: Make sure to set **Root Directory** to `backend` in Render settings!

### Step 3: Add Environment Variables

In Render dashboard, add these environment variables:

```env
# Required
DATABASE_URL=postgresql://your_neon_db_url_here
ASI_API_KEY=your_asi_api_key
ASI_BASE_URL=https://inference.asicloud.cudos.org/v1
ASI_MODEL=qwen/qwen3-32b
OPENAI_API_KEY=your_openai_api_key

# Optional
TAVILY_API_KEY=your_tavily_api_key
FETCH_AI_API_KEY=your_fetchai_api_key
IPFS_API_URL=/ip4/127.0.0.1/tcp/5001
USE_FETCHAI=true
```

**Database Setup:**
- Use [Neon](https://neon.tech) for free PostgreSQL
- Or use Render's PostgreSQL add-on
- Copy the connection string to `DATABASE_URL`

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Your backend will be live at: `https://oriki-backend.onrender.com`

### Step 5: Initialize Database

After first deployment, run migration:

```bash
# Using Render Shell
python migrate_add_patterns.py
python seed_database.py
```

Or use Render's Shell feature in the dashboard.

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

Ensure `vercel.json` exists in the `frontend` directory (already created).

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://oriki-backend.onrender.com
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build (2-5 minutes)
3. Your frontend will be live at: `https://your-project.vercel.app`

### Step 5: Update Backend CORS

Update `backend/main.py` to allow your Vercel domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-project.vercel.app",  # Add your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Commit and push to trigger redeployment.

---

## 🔄 Continuous Deployment

### Automatic Deployments

Both Vercel and Render support automatic deployments:

- **Vercel**: Automatically deploys on push to `main` branch
- **Render**: Automatically deploys on push to `main` branch

### Branch Deployments

**Vercel** (automatic):
- Every branch gets a preview deployment
- Pull requests get preview URLs

**Render** (manual):
- Create separate services for staging/production
- Use different branches

---

## 🧪 Testing Deployment

### Test Backend

```bash
# Health check
curl https://oriki-backend.onrender.com/health

# Test query
curl -X POST https://oriki-backend.onrender.com/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is Ubuntu philosophy?"}'
```

### Test Frontend

1. Visit your Vercel URL
2. Try querying the knowledge base
3. Upload cultural knowledge
4. Check all features work

---

## 🐛 Troubleshooting

### Backend Issues

**Build fails:**
- Check `requirements.txt` is complete
- Verify Python version in `runtime.txt`
- Check Render logs for errors

**Database connection fails:**
- Verify `DATABASE_URL` is correct
- Ensure database is accessible
- Run migrations

**API errors:**
- Check all environment variables are set
- Verify API keys are valid
- Check Render logs

### Frontend Issues

**Build fails:**
- Check `package.json` dependencies
- Verify Node.js version
- Check Vercel build logs

**API connection fails:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend CORS settings
- Test backend endpoint directly

**Environment variables not working:**
- Ensure they start with `NEXT_PUBLIC_`
- Redeploy after adding variables
- Check Vercel environment settings

---

## 📊 Monitoring

### Render

- View logs in Render dashboard
- Set up health checks
- Monitor resource usage

### Vercel

- View deployment logs
- Check Analytics tab
- Monitor function execution

---

## 💰 Cost Optimization

### Free Tier Limits

**Render Free Tier:**
- 750 hours/month
- Spins down after 15 min inactivity
- 512 MB RAM

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Unlimited deployments
- Serverless functions

### Tips

1. Use Neon free tier for PostgreSQL
2. Implement caching to reduce API calls
3. Optimize images and assets
4. Use CDN for static files

---

## 🔒 Security

### Environment Variables

- Never commit `.env` files
- Use Render/Vercel secret management
- Rotate API keys regularly

### CORS

- Only allow your frontend domain
- Don't use `allow_origins=["*"]` in production

### Database

- Use strong passwords
- Enable SSL connections
- Regular backups

---

## 📈 Scaling

### When to Upgrade

**Backend (Render):**
- Upgrade to paid plan for:
  - Always-on service (no spin down)
  - More RAM/CPU
  - Multiple instances

**Frontend (Vercel):**
- Upgrade for:
  - More bandwidth
  - Advanced analytics
  - Team collaboration

---

## 🎉 Success!

Your Oríkì deployment is complete!

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://oriki-backend.onrender.com`
- **API Docs**: `https://oriki-backend.onrender.com/docs`

Share your deployment and help preserve cultural wisdom! 🌍
