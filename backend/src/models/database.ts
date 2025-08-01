import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || `mongodb+srv://vida1997zarei:test123@cluster0.fimrovg.mongodb.net/Nox-Metal?retryWrites=true&w=majority&appName=Cluster0`;

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  full_name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  image_url: {
    type: String,
    trim: true
  },
  is_deleted: {
    type: Boolean,
    default: false
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Audit Log Schema
const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['create', 'update', 'delete', 'restore'],
    required: true
  },
  user_email: {
    type: String,
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  product_name: {
    type: String
  },
  details: {
    type: String
  },
  timestamp: {
    type: Date,
    default: () => {
      const now = new Date();
      return new Date(now.toLocaleString("en-US", {timeZone: "America/Toronto"}));
    }
  }
});

// Create Models
export const User = mongoose.model('User', userSchema);
export const Product = mongoose.model('Product', productSchema);
export const AuditLog = mongoose.model('AuditLog', auditLogSchema);