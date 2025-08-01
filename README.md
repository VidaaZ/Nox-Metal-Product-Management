# Full-Stack Product Management App with Authentication, Authorization, and Audit Logging

A complete full-stack application built with React, TypeScript, and Express.js featuring user authentication, role-based access control, product management, and comprehensive audit logging.

## Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control (Admin/User)
- Protected routes and middleware

### Product Management
- CRUD operations for products
- Pagination, search, and sorting
- Soft delete functionality
- Admin-only create/edit/delete permissions
- User-friendly product listing

### Audit Logging
- Complete audit trail for all product actions
- Tracks user, timestamp, action type, and details
- Admin-only audit log viewing
- Database-stored audit logs

### Technical Features
- TypeScript throughout (frontend and backend)
- SQLite database with proper schema
- RESTful API design
- Comprehensive error handling
- Security best practices (helmet, bcrypt, JWT)

## Technology Stack

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **SQLite3** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logging
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Modern state management** - Context API

## Project Structure

The project follows a monorepo structure with separate backend and frontend directories. The backend uses MVC architecture with controllers handling business logic, routes defining API endpoints, middleware for authentication and authorization, models for database operations, and utilities for common functions. The frontend is built with React and TypeScript, using Vite as the build tool, with components organized by feature and shared utilities in the lib directory.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Nox-Metal
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Start the development servers:
```bash
# From the root directory
npm run dev
```

This will start both the backend (port 3001) and frontend (port 5173/5174) servers.

### Available Scripts

#### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run create-admin` - Create admin user

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/auth/users` - Get all users (admin only)

### Products
- `GET /api/products` - Get products with pagination/search/sort
- `GET /api/products/:id` - Get specific product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Soft delete product (admin only)
- `PATCH /api/products/:id/restore` - Restore deleted product (admin only)

### Audit Logs
- `GET /api/audit` - Get audit logs with pagination (admin only)

## Testing Guide for Hiring Managers

### Quick Setup for Testing
```bash
# 1. Clone and setup
git clone <repository-url>
cd Nox-Metal
npm run install:all

# 2. Start the application
npm run dev

# 3. Run tests
cd backend && npm test
```

### Test Credentials
- **Admin User**: admin@example.com / admin123
- **Regular User**: user@example.com / user123
- **Or create new users** through the registration form

### What to Test

#### 🔐 Authentication Testing
1. **Register a new user** - Test user creation
2. **Login with credentials** - Verify authentication
3. **Access protected routes** - Ensure proper authorization
4. **Test role-based access** - Admin vs User permissions

#### 📦 Product Management Testing
1. **Create products** (admin only) - Add new items
2. **View product list** - Test pagination and search
3. **Edit products** (admin only) - Modify existing items
4. **Delete products** (admin only) - Soft delete functionality
5. **Restore products** (admin only) - Recover deleted items
6. **Search and sort** - Test filtering capabilities

#### 📊 Audit Logging Testing
1. **View audit logs** (admin only) - Check logging system
2. **Perform actions** - Create/edit/delete products
3. **Verify logging** - Ensure actions are tracked properly

#### 🧪 Code Quality Testing
1. **Run test suite** - Execute all tests
2. **Check error handling** - Test edge cases
3. **Review code structure** - Examine organization

### Expected Behavior
- ✅ All tests should pass
- ✅ Authentication should work properly
- ✅ Role-based access should be enforced
- ✅ Product CRUD operations should function
- ✅ Audit logging should track all actions
- ✅ UI should be responsive and user-friendly

## Deployment Options

### Option 1: Local Testing (Recommended)
Follow the "Quick Setup for Testing" instructions above.

### Option 2: Deploy to Vercel (Free)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel

# Deploy backend (requires database setup)
cd ../backend
vercel
```

### Option 3: Deploy to Railway (Free)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy entire project
railway login
railway init
railway up
```

## Demo Credentials
- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

## Test Coverage
- **Backend Tests**: 20 tests covering core logic
- **Frontend Tests**: Component testing with React Testing Library
- **Security Tests**: Password hashing, JWT validation
- **Validation Tests**: Input sanitization and business rules


