# Full-Stack Product Management App with Authentication, Authorization, and Audit Logging

A complete full-stack application built with React, TypeScript, and Express.js featuring user authentication, role-based access control, product management, and comprehensive audit logging.

## 🚀 Features

### Authentication & Authorization
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin/User)
- ✅ Protected routes and middleware

### Product Management
- ✅ CRUD operations for products
- ✅ Pagination, search, and sorting
- ✅ Soft delete functionality
- ✅ Admin-only create/edit/delete permissions
- ✅ User-friendly product listing

### Audit Logging
- ✅ Complete audit trail for all product actions
- ✅ Tracks user, timestamp, action type, and details
- ✅ Admin-only audit log viewing
- ✅ Database-stored audit logs

### Technical Features
- ✅ TypeScript throughout (frontend and backend)
- ✅ SQLite database with proper schema
- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Security best practices (helmet, bcrypt, JWT)

## 🛠️ Technology Stack

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **SQLite3** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logging
- **CORS** - Cross-origin resource sharing

### Frontend (Coming Next)
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Modern state management** - Context API or Zustand

## 📦 Project Structure

```
Nox-Metal/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Authentication & authorization
│   │   ├── models/          # Database models and setup
│   │   ├── routes/          # API routes
│   │   ├── scripts/         # Utility scripts
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # Helper functions
│   │   └── index.ts         # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React frontend (in progress)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── package.json             # Root package.json
└── README.md
```

## 🚦 Getting Started

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

## 🔧 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "user" // optional, defaults to "user"
}
```

#### POST `/api/auth/login`
Login user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/profile`
Get current user profile (requires authentication)

#### POST `/api/auth/refresh`
Refresh JWT token (requires authentication)

### Product Endpoints

#### GET `/api/products`
Get products with pagination, search, and filtering
- Query parameters: `page`, `limit`, `search`, `sortBy`, `sortOrder`, `includeDeleted`
- Requires authentication

#### GET `/api/products/:id`
Get single product (requires authentication)

#### POST `/api/products`
Create new product (admin only)
```json
{
  "name": "Product Name",
  "price": 29.99,
  "description": "Product description",
  "image_url": "https://example.com/image.jpg"
}
```

#### PUT `/api/products/:id`
Update product (admin only)

#### DELETE `/api/products/:id`
Soft delete product (admin only)

#### PATCH `/api/products/:id/restore`
Restore deleted product (admin only)

### Audit Endpoints

#### GET `/api/audit`
Get audit logs with pagination (admin only)
- Query parameters: `page`, `limit`

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `password` - Hashed password
- `role` - User role (admin/user)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Products Table
- `id` - Primary key
- `name` - Product name
- `price` - Product price
- `description` - Product description
- `image_url` - Product image URL
- `is_deleted` - Soft delete flag
- `created_by` - User ID who created the product
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Audit Logs Table
- `id` - Primary key
- `action` - Action type (create/update/delete/restore)
- `user_email` - Email of user who performed action
- `product_id` - Related product ID
- `product_name` - Product name at time of action
- `details` - Additional action details
- `timestamp` - When action occurred

## 🔐 Default Admin Credentials

After running `npm run create-admin`:
- **Email**: admin@example.com
- **Password**: admin123

⚠️ **Please change these credentials after first login!**

## 📈 Progress Status

- ✅ **Backend Complete** - Full API with authentication, products, and audit logging
- 🚧 **Frontend In Progress** - React app with authentication and product management
- ⏳ **Image Upload** - Optional feature to be implemented
- ⏳ **Unit Tests** - Backend testing to be added
- ⏳ **Deployment** - Preparation for hosting

## 🧪 Testing the API

You can test the API using tools like Postman or curl:

1. Register/login to get JWT token
2. Include token in Authorization header: `Bearer <token>`
3. Test various endpoints with proper permissions

## 🤝 Contributing

This is a take-home project, but the structure supports:
- Clean code practices
- TypeScript strict mode
- Comprehensive error handling
- Security best practices
- Scalable architecture

## 📄 License

This project is created as a technical assessment.
