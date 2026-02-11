# Render Deployment Guide

## 🚀 Deploy Backend to Render

### Prerequisites
- GitHub repository: https://github.com/saivignesh060/physics-visualiser
- Render account: https://render.com (sign up with GitHub)

### Deployment Steps

#### Option 1: Using render.yaml (Recommended)

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" → "Blueprint"

2. **Connect Repository**
   - Select "Connect a repository"
   - Choose `saivignesh060/physics-visualiser`
   - Render will detect the `render.yaml` file

3. **Configure Environment Variables**
   - `FRONTEND_URL`: Your frontend URL (e.g., `https://your-frontend.vercel.app` or `http://localhost:5173` for testing)
   - `GEMINI_API_KEY`: (Optional) Your Gemini API key if you want AI features
   - `NODE_ENV`: `production` (auto-set)

4. **Deploy**
   - Click "Apply"
   - Render will automatically build and deploy your backend
   - Your API will be available at: `https://physics-visualizer-backend.onrender.com`

#### Option 2: Manual Setup

1. **Create New Web Service**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `physics-visualizer-backend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

3. **Environment Variables**
   Add these in the "Environment" section:
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://your-frontend-url.com
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (3-5 minutes)

### Post-Deployment

#### 1. Test Your API
```bash
# Health check
curl https://physics-visualizer-backend.onrender.com/health

# Get all simulations
curl https://physics-visualizer-backend.onrender.com/api/simulations

# Match simulation
curl -X POST https://physics-visualizer-backend.onrender.com/api/match-simulation \
  -H "Content-Type: application/json" \
  -d '{"query": "A ball is thrown straight up"}'
```

#### 2. Update Frontend
Update your frontend to use the Render backend URL:

In `frontend/.env` or `frontend/.env.production`:
```env
VITE_API_URL=https://physics-visualizer-backend.onrender.com
```

Then update your frontend API calls to use:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
```

### Important Notes

⚠️ **Free Tier Limitations:**
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free (enough for 1 service)

✅ **Auto-Deploy:**
- Render automatically redeploys when you push to `main` branch
- Build logs available in Render dashboard

🔒 **CORS:**
- Backend is configured to accept requests from `FRONTEND_URL`
- Update `FRONTEND_URL` environment variable after deploying frontend

### Troubleshooting

**Build Fails:**
- Check build logs in Render dashboard
- Ensure `backend/package.json` has correct scripts
- Verify TypeScript compiles locally: `cd backend && npm run build`

**Service Won't Start:**
- Check that `PORT` environment variable is set
- Verify start command: `npm start`
- Check logs for errors

**CORS Errors:**
- Update `FRONTEND_URL` environment variable
- Ensure frontend URL matches exactly (no trailing slash)

**API Not Responding:**
- Service may be spinning down (free tier)
- First request takes 30-60 seconds to wake up
- Check service status in Render dashboard

### Monitoring

- **Logs**: Available in Render dashboard
- **Metrics**: CPU, Memory usage visible in dashboard
- **Health Check**: `/health` endpoint returns server status

### Upgrading

To upgrade from free tier:
1. Go to service settings
2. Change plan to "Starter" ($7/month)
3. Benefits: No spin-down, faster builds, more resources

---

**Your backend will be live at:**
`https://physics-visualizer-backend.onrender.com`

**API Endpoints:**
- `GET /health` - Health check
- `GET /api/simulations` - Get all simulations
- `GET /api/simulations/:id` - Get simulation by ID
- `GET /api/simulations/domain/:domain` - Get by domain
- `POST /api/match-simulation` - Match query to simulation
