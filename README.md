 Nox Metal Product Management System

A full-stack product management application built for the Nox Metals coding challenge. This project demonstrates modern web development skills with React, TypeScript, Express, and MongoDB.

Live Demo

- Frontend Application: https://nox-metal-product-management.vercel.app
- Backend API: https://nox-metal-product-management-production.up.railway.app

Assignment Requirements Completed

+ Authentication & Authorization
-  User registration and login functionality
-  Secure backend authentication with JWT
-  Role-based access control (Admin/User roles)
-  Admin-only product management operations
-  User-only product viewing capabilities

+ Product Management
- Complete CRUD operations for products
- Product attributes: Name, Price, Description, Image Upload
- Pagination, search, and sorting functionality
- Edit feature (Admin only)
- Soft delete with restore functionality
- Image upload for product photos

+ API & Backend
-  RESTful APIs for product CRUD operations
-  Protected routes using middleware
-  Comprehensive audit logging for all product actions
-  Timestamp, action performed, and user email logging

+ Frontend-Backend Communication
- Modern state management using Context API
- Search, sort, filter, and pagination implementation
- Admin audit log viewing from frontend

+ Deployment
- Frontend deployed on Vercel
- Backend deployed on Railway
- MongoDB Atlas database integration

** Technical Stack **

+ Frontend
- React 19 with TypeScript
- Vite for fast build tooling
- Context API for state management
- Responsive design for mobile and desktop

+ Backend
- Node.js + Express + TypeScript
- JWT authentication system
- MongoDB Atlas for database
- Multer for file uploads
- Role-based middleware for authorization

* Test Credentials

*Admin User

Email: admin@example.com
Password: admin123

*Regular User

Email: noxmetaltest@gmail.com
Password: Test123


*API Documentation

* Base URL

https://nox-metal-product-management-production.up.railway.app

*Health check:
https://nox-metal-product-management-production.up.railway.app/health

*Authentication Endpoints

POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile (requires token)


*Product Endpoints (All require authentication)
http
GET /api/products
GET /api/products/:id
POST /api/products (Admin only)
PUT /api/products/:id (Admin only)
DELETE /api/products/:id (Admin only)
PATCH /api/products/:id/restore (Admin only)


*Audit Logs
http
GET /api/audit (requires authentication)


 Testing the API

 Using Postman

1.Set up environment variables:
   - `Base_URL`: `https://nox-metal-product-management-production.up.railway.app`
   - `AuthToken`: (will be set after login)

2.Test sequence:
   
   1. Health check
   GET {{Base_URL}}/health
   
   2. Register user
   POST {{Base_URL}}/api/auth/register
   
   
   3. Login
   POST {{Base_URL}}/api/auth/login
   
   
   4. Get products (with token)
   GET {{Base_URL}}/api/products
   Headers: Authorization: Bearer {{AuthToken}}
   

* Key Features

+ Authentication System
- User registration and login with email/password
- JWT token-based authentication
- Role-based access control (Admin/User)
- Secure password hashing with bcrypt

+ Product Management
- Add, edit, delete products (Admin only)
- Image upload functionality for product photos
- Soft delete with restore capability
- Search, sort, and filter products
- Pagination for large product lists

+ Audit Logging
- Complete audit trail for all product actions
- Timestamp, action performed, and user email tracking
- Admin-only audit log viewing from frontend
- Detailed logging for security and compliance

