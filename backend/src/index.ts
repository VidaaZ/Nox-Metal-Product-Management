import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import auditRoutes from './routes/audit.js';
import './models/database.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://nox-metal-product-management.vercel.app',
  'https://nox-metal-product-management.vercel.app/',
  'https://nox-metal-product-management-git-main-vidas-projects-f4001eed.vercel.app',
  'https://nox-metal-product-management-rfz6t79uh-vidas-projects-f4001eed.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    console.log('CORS check for origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    // Temporarily allow all origins for debugging
    console.log('CORS: Allowing all origins for debugging');
    callback(null, true);
    
    // Original logic (commented out for debugging):
    // if (allowedOrigins.indexOf(origin) !== -1) {
    //   console.log('CORS: Allowing origin:', origin);
    //   callback(null, true);
    // } else {
    //   console.log('CORS blocked origin:', origin);
    //   callback(new Error('Not allowed by CORS'));
    // }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('combined'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/audit', auditRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit from origin:', req.headers.origin);
  res.json({ message: 'CORS test successful', origin: req.headers.origin });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Auto-create admin user in production
  if (process.env.NODE_ENV === 'production') {
    console.log('Production environment detected - auto-creating admin user...');
    import('./scripts/createAdmin.js').then(() => {
      console.log('Admin user creation script completed');
    }).catch(error => {
      console.error('Error running admin creation script:', error);
    });
  }
}); 