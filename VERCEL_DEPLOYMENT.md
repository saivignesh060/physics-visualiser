# Vercel Deployment Guide for Frontend

## 🚀 Deploy Frontend to Vercel

### Prerequisites
- Vercel account: https://vercel.com (sign up with GitHub)
- Backend deployed on Render: https://physics-visualizer-backend.onrender.com

### Deployment Steps

#### Option 1: Using Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click **"Add New..."** → **"Project"**

2. **Import Repository**
   - Click **"Import Git Repository"**
   - Select `saivignesh060/physics-visualiser`
   - Click **"Import"**

3. **Configure Project**
   - **Framework Preset:** Vite (auto-detected)
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Add Environment Variables**
   Click **"Environment Variables"** and add:
   ```
   Name: VITE_API_URL
   Value: https://physics-visualizer-backend.onrender.com
   ```

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes for build to complete
   - Your app will be live at: `https://physics-visualiser-[random].vercel.app`

#### Option 2: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Frontend Directory**
   ```bash
   cd frontend
   vercel
   ```

4. **Follow Prompts**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? `physics-visualiser-frontend`
   - Directory? `./` (already in frontend)
   - Override settings? **N**

5. **Set Environment Variable**
   ```bash
   vercel env add VITE_API_URL production
   # Enter: https://physics-visualizer-backend.onrender.com
   ```

6. **Redeploy with Environment Variable**
   ```bash
   vercel --prod
   ```

### Post-Deployment

#### 1. Update Backend CORS
After deployment, you need to update your backend's `FRONTEND_URL` environment variable:

1. Go to Render dashboard
2. Select `physics-visualizer-backend` service
3. Go to **Environment** tab
4. Update `FRONTEND_URL` to your Vercel URL:
   ```
   https://physics-visualiser-[your-url].vercel.app
   ```
5. Save and wait for automatic redeploy

#### 2. Test Your Application

Visit your Vercel URL and test:
- ✅ Homepage loads
- ✅ Login/Register works
- ✅ Simulation browser loads simulations
- ✅ Keyword matching works
- ✅ Simulations run smoothly
- ✅ Parameter controls update in real-time

#### 3. Custom Domain (Optional)

1. Go to Vercel project settings
2. Click **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update backend `FRONTEND_URL` to your custom domain

### Environment Variables

**Required:**
- `VITE_API_URL`: Your Render backend URL
  - Production: `https://physics-visualizer-backend.onrender.com`
  - Development: `http://localhost:3000`

### Vercel Configuration

The `vercel.json` file is configured with:
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Framework: Vite
- ✅ Install command: `npm install`

### Automatic Deployments

**Production Deployments:**
- Every push to `main` branch triggers production deployment
- Vercel builds and deploys automatically

**Preview Deployments:**
- Every pull request gets a preview URL
- Perfect for testing before merging

### Troubleshooting

**Build Fails:**
- Check build logs in Vercel dashboard
- Ensure `frontend/package.json` has correct scripts
- Verify TypeScript compiles locally: `npm run build`

**API Calls Fail (CORS):**
- Update `FRONTEND_URL` in Render backend
- Ensure URL matches exactly (no trailing slash)
- Check browser console for CORS errors

**Environment Variables Not Working:**
- Ensure variable name starts with `VITE_`
- Redeploy after adding environment variables
- Check Vercel logs for environment variable values

**Blank Page After Deploy:**
- Check browser console for errors
- Verify `dist` folder is being deployed
- Check Vercel build logs

### Monitoring

- **Analytics:** Available in Vercel dashboard
- **Logs:** Real-time function logs
- **Performance:** Web Vitals tracking
- **Deployments:** History of all deployments

### Upgrading

**Free Tier Includes:**
- Unlimited deployments
- Automatic HTTPS
- Global CDN
- Preview deployments

**Pro Tier ($20/month):**
- Custom domains
- More bandwidth
- Advanced analytics
- Team collaboration

---

**Your frontend will be live at:**
`https://physics-visualiser-[random].vercel.app`

**Complete Stack:**
- Frontend: Vercel
- Backend: Render
- Repository: GitHub

🎉 **Full-stack deployment complete!**
