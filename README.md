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

## Deployment Notes

This application is deployed on Render using SQLite database. 

**Important**: The database resets on each deployment, so:
- All users need to re-register after deployment
- Admin user is auto-created with credentials: `admin@example.com` / `admin123`
- All products and audit logs are reset

For production use, consider using PostgreSQL for persistent data.

### Demo Credentials
After deployment, you can use these credentials to test the application:
- **Admin**: `admin@example.com` / `admin123`
- **Register new users** to test different roles and permissions

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


