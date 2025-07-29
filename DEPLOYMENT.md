# 🚀 Deployment Guide

This guide will help you deploy your full-stack product management application to Railway (recommended) or other free hosting platforms.

## 🎯 **Recommended: Railway Deployment**

### **Why Railway?**
- ✅ **Free Tier**: $5/month credit (sufficient for small projects)
- ✅ **Full-Stack Support**: Host both frontend and backend
- ✅ **Database Support**: SQLite and PostgreSQL
- ✅ **Easy Setup**: Connect GitHub repository
- ✅ **Automatic Deployments**: Deploy on every push
- ✅ **Custom Domains**: Free subdomain included

## 📋 **Pre-Deployment Checklist**

### **1. Environment Variables Setup**

#### **Backend Environment Variables:**
```bash
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3001
```

#### **Frontend Environment Variables:**
```bash
VITE_API_URL=https://your-backend-domain.railway.app/api
```

### **2. Database Considerations**

**Option A: SQLite (Current)**
- ✅ Simple, no setup required
- ❌ Data resets on deployment
- ❌ Not suitable for production

**Option B: PostgreSQL (Recommended)**
- ✅ Persistent data
- ✅ Better for production
- ✅ Railway provides free PostgreSQL

## 🛠️ **Railway Deployment Steps**

### **Step 1: Prepare Your Repository**

1. **Push to GitHub** (if not already done):
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

2. **Ensure these files exist**:
- ✅ `backend/package.json` (with build/start scripts)
- ✅ `backend/railway.json` (Railway config)
- ✅ `frontend/package.json` (with build script)

### **Step 2: Deploy Backend**

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Select the `backend` folder**
7. **Add Environment Variables**:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-here
   ```
8. **Deploy** - Railway will automatically:
   - Install dependencies
   - Run `npm run build`
   - Start the server with `npm start`

### **Step 3: Deploy Frontend**

1. **Create another Railway project**
2. **Select your repository again**
3. **Select the `frontend` folder**
4. **Add Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-domain.railway.app/api
   ```
5. **Deploy** - Railway will:
   - Install dependencies
   - Run `npm run build`
   - Serve the static files

### **Step 4: Update CORS Settings**

After getting your frontend URL, update the backend CORS settings:

1. **Go to your backend Railway project**
2. **Add Environment Variable**:
   ```
   FRONTEND_URL=https://your-frontend-domain.railway.app
   ```
3. **Redeploy** the backend

## 🔧 **Alternative Deployment Options**

### **Option 1: Vercel (Frontend) + Railway (Backend)**

**Frontend on Vercel:**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend-domain.railway.app/api`

**Backend on Railway:**
- Follow the Railway backend deployment steps above

### **Option 2: Render**

**Backend on Render:**
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set root directory to `backend`
5. Build command: `npm run build`
6. Start command: `npm start`

**Frontend on Render:**
1. Create a new Static Site
2. Connect your GitHub repository
3. Set root directory to `frontend`
4. Build command: `npm run build`
5. Publish directory: `dist`

## 🧪 **Testing Your Deployment**

### **1. Health Check**
```bash
curl https://your-backend-domain.railway.app/health
# Should return: {"status":"OK","timestamp":"..."}
```

### **2. API Test**
```bash
curl https://your-backend-domain.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","full_name":"Test User","password":"password123"}'
```

### **3. Frontend Test**
- Visit your frontend URL
- Try to register/login
- Test product management features

## 🔒 **Security Considerations**

### **Environment Variables**
- ✅ Never commit secrets to GitHub
- ✅ Use Railway's environment variable system
- ✅ Rotate JWT secrets regularly

### **CORS Configuration**
- ✅ Only allow your frontend domain
- ✅ Remove localhost from production CORS

### **Database Security**
- ✅ Use strong passwords for database
- ✅ Enable SSL connections
- ✅ Regular backups

## 📊 **Monitoring & Maintenance**

### **Railway Dashboard**
- Monitor resource usage
- View logs and errors
- Check deployment status

### **Health Checks**
- Backend: `/health` endpoint
- Frontend: Static file serving

### **Logs**
- Railway provides real-time logs
- Monitor for errors and performance

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **Build Fails**
   - Check `package.json` scripts
   - Verify TypeScript compilation
   - Check for missing dependencies

2. **CORS Errors**
   - Verify frontend URL in backend CORS settings
   - Check environment variables

3. **Database Issues**
   - SQLite: Data resets on deployment
   - Consider PostgreSQL for persistence

4. **Environment Variables**
   - Double-check variable names
   - Redeploy after adding variables

## 📝 **Final Steps**

1. **Test everything thoroughly**
2. **Update your README.md** with live URLs
3. **Create admin user** using the backend script
4. **Document your deployment** for the submission

## 🎉 **Success!**

Your application is now live and ready for submission! The deployment demonstrates:
- ✅ Full-stack deployment knowledge
- ✅ Environment configuration
- ✅ Production-ready setup
- ✅ Security best practices

**Your URLs will look like:**
- Frontend: `https://your-app-name.railway.app`
- Backend: `https://your-backend-name.railway.app`
- API: `https://your-backend-name.railway.app/api` 