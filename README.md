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
