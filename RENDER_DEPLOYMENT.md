# Render Deployment Guide

## 🚀 How to Deploy Your App to Render

### **Step 1: Prepare Your Repository**

1. **Push your code to GitHub** (if not already done)
2. **Ensure all files are committed** including the new `render.yaml`

### **Step 2: Deploy to Render**

#### **Option A: Using render.yaml (Recommended)**
1. Go to [render.com](https://render.com)
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Click "Apply" to deploy both services

#### **Option B: Manual Deployment**
1. **Deploy Backend:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Set **Root Directory** to `backend`
   - Set **Build Command** to `npm install && npm run build`
   - Set **Start Command** to `npm start`
   - Add Environment Variables:
     ```
     NODE_ENV=production
     PORT=10000
     JWT_SECRET=your-super-secret-jwt-key-here-123456
     FRONTEND_URL=https://your-frontend-url.onrender.com
     ```

2. **Deploy Frontend:**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Set **Root Directory** to `frontend`
   - Set **Build Command** to `npm install && npm run build`
   - Set **Publish Directory** to `dist`
   - Add Environment Variable:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```

### **Step 3: Environment Variables**

#### **Backend Environment Variables:**
```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-here-123456
FRONTEND_URL=https://your-frontend-url.onrender.com
```

#### **Frontend Environment Variables:**
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### **Step 4: Important Notes**

#### **✅ What Works:**
- **SQLite Database** - File-based, works on Render
- **Authentication** - JWT tokens work perfectly
- **Product Management** - Full CRUD operations
- **Audit Logging** - Complete audit trail
- **File Uploads** - Images stored in `/uploads` directory

#### **⚠️ Limitations:**
- **SQLite** - Data resets when service restarts (free tier)
- **File Uploads** - Files are lost on service restart (free tier)
- **Cold Starts** - Services sleep after 15 minutes of inactivity

### **Step 5: Production Database (Optional)**

For persistent data, consider upgrading to a **PostgreSQL database**:

1. **Add PostgreSQL Service** in Render
2. **Update Environment Variables:**
   ```
   DB_HOST=your-postgres-host
   DB_PORT=5432
   DB_NAME=your-database-name
   DB_USER=your-username
   DB_PASSWORD=your-password
   ```

### **Step 6: Custom Domain (Optional)**

1. **Add Custom Domain** in Render dashboard
2. **Update CORS** in `backend/src/index.ts`
3. **Update Environment Variables** with your domain

### **Step 7: Monitoring**

- **Logs** - Available in Render dashboard
- **Health Check** - Visit `/health` endpoint
- **Performance** - Monitor in Render dashboard

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] `render.yaml` file created
- [ ] Environment variables set
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] API communication working
- [ ] Authentication working
- [ ] Product management working
- [ ] File uploads working

## 🎯 Your App URLs

After deployment, you'll have:
- **Frontend:** `https://your-app-name.onrender.com`
- **Backend:** `https://your-backend-name.onrender.com`

## 🚀 Success!

Your app is now live on Render! 🎉 