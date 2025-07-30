# PostgreSQL Migration Guide

## 🚀 How to Switch from SQLite to PostgreSQL

### **Step 1: Environment Variables**

Add these environment variables to switch to PostgreSQL:

```bash
# Set to 'true' to use PostgreSQL, 'false' or omit for SQLite
USE_POSTGRESQL=true

# PostgreSQL connection details
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nox_metal
DB_USER=postgres
DB_PASSWORD=your_password
```

### **Step 2: Install PostgreSQL**

#### **Option A: Local PostgreSQL**
```bash
# Windows (using Chocolatey)
choco install postgresql

# macOS (using Homebrew)
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
```

#### **Option B: Docker PostgreSQL**
```bash
docker run --name postgres-nox-metal \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=nox_metal \
  -p 5432:5432 \
  -d postgres:15
```

### **Step 3: Initialize Database**

The database will be automatically initialized when you start the application with `USE_POSTGRESQL=true`.

### **Step 4: Test the Migration**

1. **Start with SQLite** (current):
```bash
npm run dev
```

2. **Switch to PostgreSQL**:
```bash
USE_POSTGRESQL=true npm run dev
```

## 🔄 Migration Benefits

### **✅ What Works the Same:**
- All API endpoints
- Authentication system
- Product management
- Audit logging
- File uploads
- Frontend functionality

### **🚀 PostgreSQL Advantages:**
- **Better performance** for complex queries
- **Concurrent connections** (connection pooling)
- **Advanced data types** (JSON, arrays)
- **Better indexing** options
- **Production ready** scalability

## 📊 Database Comparison

| Feature | SQLite | PostgreSQL |
|---------|--------|------------|
| **Type** | File-based | Client-Server |
| **Concurrency** | Single writer | Multiple writers |
| **Performance** | Good for small apps | Excellent for production |
| **Scalability** | Limited | Highly scalable |
| **Data Types** | Basic | Advanced (JSON, arrays) |

## 🛠️ Code Changes

### **Current SQLite Code:**
```typescript
db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
  // Handle result
});
```

### **PostgreSQL Code (Automatic):**
```typescript
// The database service handles this automatically
const result = await dbService.get('SELECT * FROM users WHERE id = $1', [userId]);
```

## 🎯 Migration Strategy

### **Phase 1: Dual Support** ✅
- Both SQLite and PostgreSQL work
- Switch with environment variable
- No breaking changes

### **Phase 2: PostgreSQL Only** (Optional)
- Remove SQLite dependencies
- Optimize for PostgreSQL
- Deploy to production

## 🚀 Deployment

### **Local Development:**
```bash
# Use SQLite (default)
npm run dev

# Use PostgreSQL
USE_POSTGRESQL=true npm run dev
```

### **Production Deployment:**
```bash
# Always use PostgreSQL in production
USE_POSTGRESQL=true
DB_HOST=your-postgres-host
DB_NAME=your-database-name
DB_USER=your-username
DB_PASSWORD=your-password
```

## ✅ Migration Complete!

Your application now supports both SQLite and PostgreSQL with zero breaking changes! 