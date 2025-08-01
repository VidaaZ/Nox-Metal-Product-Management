# Quick Deployment Guide

## For Hiring Managers - Quick Testing Setup

### Option 1: Local Testing (5 minutes)
```bash
# 1. Clone the repository
git clone <your-repo-url>
cd Nox-Metal

# 2. Install dependencies
npm run install:all

# 3. Start the application
npm run dev

# 4. Open in browser
# Frontend: http://localhost:5173
# Backend: http://localhost:3001
```

### Option 2: Deploy to Vercel (10 minutes)

#### Frontend Deployment:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --yes
```

#### Backend Deployment:
```bash
# Deploy backend
cd ../backend
vercel --yes
```

### Option 3: Deploy to Railway (15 minutes)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## Test Credentials
- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

## What to Test (Priority Order)

### 1. 🔐 Authentication (CRITICAL)
- [ ] Register new user
- [ ] Login with credentials
- [ ] Test admin vs user permissions
- [ ] Verify protected routes

### 2. 📦 Product Management (CORE)
- [ ] Create products (admin only)
- [ ] View product list with pagination
- [ ] Edit products (admin only)
- [ ] Delete products (admin only)
- [ ] Search and sort functionality
- [ ] Restore deleted products (admin only)

### 3. 📊 Audit Logging (DEMONSTRATES ATTENTION TO DETAIL)
- [ ] View audit logs (admin only)
- [ ] Perform actions and verify logging
- [ ] Test audit log pagination

### 4. 🧪 Code Quality (BEHIND THE SCENES)
- [ ] Run test suite: `cd backend && npm test`
- [ ] Check error handling
- [ ] Review code structure

## Expected Results
- ✅ All 20 tests pass
- ✅ Authentication works properly
- ✅ Role-based access is enforced
- ✅ Product CRUD operations function
- ✅ Audit logging tracks all actions
- ✅ UI is responsive and user-friendly

## Quick Commands for Testing
```bash
# Start application
npm run dev

# Run tests
cd backend && npm test

# Create admin user
cd backend && npm run create-admin
``` 