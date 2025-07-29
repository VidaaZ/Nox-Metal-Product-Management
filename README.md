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

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Nox-Metal
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Create initial admin user**
   ```bash
   cd backend
   npm run create-admin
   ```

5. **Start the development servers**
   ```bash
   # From root directory
   npm run dev
   ```

This will start both backend (port 3001) and frontend (port 5173) simultaneously.
