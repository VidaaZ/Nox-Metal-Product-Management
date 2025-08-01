import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectToDatabase } from './models/database.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'MongoDB Atlas migration successful!', database: 'Connected' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database connection and start server
console.log('Starting server...');
console.log('Attempting to connect to database...');
connectToDatabase()
  .then(() => {
    console.log('Database connected successfully, starting server...');
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
      console.log(`MongoDB Atlas connected successfully!`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Test the API: http://localhost:${PORT}/api/test`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });