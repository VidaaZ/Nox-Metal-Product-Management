# 🚀 Deployment Guide

## Overview
This guide will help you deploy your Nox-Metal Product Management app:
- **Backend**: Deploy on Railway
- **Frontend**: Already deployed on Vercel
- **Database**: MongoDB Atlas (already configured)

## 📋 Prerequisites
- GitHub repository: https://github.com/VidaaZ/Nox-Metal-Product-Management
- MongoDB Atlas account (already configured)
- Railway account (free)
- Vercel account (already connected)

## 🔧 Backend Deployment on Railway

### Step 1: Deploy Backend
1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository: `VidaaZ/Nox-Metal-Product-Management`
6. Select the `backend` directory as the source
7. Click "Deploy"

### Step 2: Configure Environment Variables
In Railway dashboard, go to your project → Variables tab and add:

```env
MONGODB_URI=mongodb+srv://vida1997zarei:test123@cluster0.fimrovg.mongodb.net/Nox-Metal?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
NODE_ENV=production
PORT=3001
```

### Step 3: Get Backend URL
1. Go to your Railway project dashboard
2. Click on your deployed service
3. Copy the generated URL (e.g., `https://your-app-name.railway.app`)

## 🔧 Frontend Update on Vercel

### Step 1: Update Environment Variables
1. Go to your Vercel dashboard
2. Select your project: `nox-metal-product-management`
3. Go to Settings → Environment Variables
4. Add new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-railway-backend-url.railway.app/api`
   - **Environment**: Production, Preview, Development

### Step 2: Redeploy Frontend
1. In Vercel dashboard, go to Deployments
2. Click "Redeploy" on the latest deployment
3. Wait for deployment to complete

## 🔍 Testing Your Deployment

### Test Backend Health
```bash
curl https://your-railway-backend-url.railway.app/health
```
Should return: `{"status":"OK","timestamp":"..."}`

### Test API Connection
```bash
curl https://your-railway-backend-url.railway.app/api/test
```
Should return: `{"message":"MongoDB Atlas migration successful!","database":"Connected"}`

## 🎯 Final URLs

After deployment, you'll have:
- **Frontend**: https://nox-metal-product-management.vercel.app
- **Backend**: https://your-railway-backend-url.railway.app
- **API**: https://your-railway-backend-url.railway.app/api

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Check that your Vercel URL is in the allowed origins
   - Update backend CORS if needed

2. **Database Connection**
   - Verify MONGODB_URI is correct
   - Check MongoDB Atlas network access

3. **Build Errors**
   - Check Railway logs for build issues
   - Verify all dependencies are in package.json

4. **Environment Variables**
   - Ensure all variables are set in Railway
   - Check variable names match exactly

## 📞 Support
If you encounter issues:
1. Check Railway logs in the dashboard
2. Check Vercel logs in the dashboard
3. Verify environment variables are set correctly
4. Test API endpoints individually

## ✅ Success Checklist
- [ ] Backend deployed on Railway
- [ ] Environment variables set in Railway
- [ ] Frontend environment variable updated in Vercel
- [ ] Frontend redeployed on Vercel
- [ ] Health check endpoint working
- [ ] API test endpoint working
- [ ] Frontend can connect to backend
- [ ] Authentication working
- [ ] Product management working 