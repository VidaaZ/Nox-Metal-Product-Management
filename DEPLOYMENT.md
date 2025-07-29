# 🚀 Deployment Guide

This guide will help you deploy your full-stack product management application to various hosting platforms.

## 📋 **Pre-Deployment Checklist**

### **1. Environment Variables Setup**

#### **Backend Environment Variables:**
```bash
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3001
FRONTEND_URL=https://your-frontend-domain.com
```

#### **Frontend Environment Variables:**
```bash
VITE_API_URL=https://your-backend-domain.com/api
```

### **2. Database Considerations**

**Option A: SQLite (Current)**
- ✅ Simple, no setup required
- ❌ Data resets on deployment
- ❌ Not suitable for production

**Option B: PostgreSQL (Recommended)**
- ✅ Persistent data
- ✅ Better for production
- ✅ Most platforms provide free PostgreSQL

## 🛠️ **Deployment Options**

### **Option 1: Render (Recommended)**
- ✅ Free tier available
- ✅ Easy setup
- ✅ Good documentation

### **Option 2: Railway**
- ✅ Free tier available
- ✅ Full-stack support
- ✅ Automatic deployments

### **Option 3: Vercel (Frontend) + Railway/Render (Backend)**
- ✅ Vercel: Excellent for frontend
- ✅ Railway/Render: Good for backend
- ✅ Separate concerns

### **Option 4: Netlify (Frontend) + Any Backend**
- ✅ Netlify: Great for static sites
- ✅ Easy deployment
- ✅ Good performance

## 📝 **General Deployment Steps**

### **Backend Deployment:**
1. **Choose your platform** (Render, Railway, etc.)
2. **Connect your GitHub repository**
3. **Set root directory to `backend`**
4. **Add environment variables**
5. **Deploy**

### **Frontend Deployment:**
1. **Choose your platform** (Vercel, Netlify, etc.)
2. **Connect your GitHub repository**
3. **Set root directory to `frontend`**
4. **Add environment variables**
5. **Deploy**

## 🔧 **Testing Your Deployment**

### **Health Check:**
```bash
curl https://your-backend-domain.com/health
```

### **API Test:**
```bash
curl https://your-backend-domain.com/api/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","full_name":"Test User"}'
```

## 📚 **Platform-Specific Guides**

For detailed instructions on specific platforms, check their official documentation:
- **Render**: https://render.com/docs
- **Railway**: https://docs.railway.app
- **Vercel**: https://vercel.com/docs
- **Netlify**: https://docs.netlify.com 