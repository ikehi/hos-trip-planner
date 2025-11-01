# 🚀 Deployment Guide - HOS Trip Planner

## Step-by-Step Deployment Instructions

### 1️⃣ Prepare & Push to GitHub

```bash
cd "C:\Users\Matthias E. Ikehi\Desktop\Fullstack app\hos_planner"
git init
git add .
git commit -m "Complete HOS Trip Planner with world-class UI"
git branch -M main
# Create a new repo on github.com called "hos-trip-planner"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

---

### 2️⃣ Deploy Backend to Render

1. **Go to**: https://render.com
2. **Sign up** (if needed) using GitHub
3. **Click** "New +" → "Web Service"
4. **Connect your GitHub** repo `hos-trip-planner`
5. **Settings**:
   - **Name**: `hos-planner-backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt && cd backend && python manage.py collectstatic --noinput`
   - **Start Command**: `cd backend && gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT`
   - **Advanced**: Add **Persistent Disk**
     - Name: `media-disk`
     - Mount Path: `/media`
     - Size: 1GB

6. **Environment Variables** (Add these):
   ```
   DEBUG=False
   ALLOWED_HOSTS=hos-planner-backend.onrender.com
   SECRET_KEY=YOUR_SECRET_KEY_HERE
   ```

7. **Click** "Create Web Service"
8. **Wait** for deployment (~5 mins)
9. **Copy** your backend URL (e.g., `https://hos-planner-backend.onrender.com`)

---

### 3️⃣ Deploy Frontend to Vercel

1. **Go to**: https://vercel.com
2. **Sign up** (if needed) using GitHub
3. **Click** "Add New..." → "Project"
4. **Import** your `hos-trip-planner` repository
5. **Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. **Environment Variables**:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: Your Render backend URL (e.g., `https://hos-planner-backend.onrender.com`)

7. **Click** "Deploy"
8. **Wait** (~2 mins)
9. **Copy** your frontend URL

---

### 4️⃣ Final Configuration

**Backend (Render)**:
- Add CORS for your Vercel domain:
  - Go to Render dashboard → Environment
  - Add: `CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app`
  - Redeploy

**Frontend (Vercel)**:
- Your app is live! Test with your Nigeria locations

---

## ✅ What You'll Have

- **Frontend**: Beautiful UI on Vercel
- **Backend**: Django API on Render
- **Global**: Works with any location worldwide
- **Free**: Both platforms offer generous free tiers

---

## 📹 For Your Loom Video

1. Show the live Vercel URL
2. Test with Lagos → Abuja trip
3. Point out the beautiful UI, map, log sheets
4. Mention the code quality & FMCSA compliance

**You're ready to win that $150!** 🏆💰

