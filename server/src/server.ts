import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import newsRoutes from './routes/newsRoutes';
import visaChatRoutes from './routes/visaChatRoutes';
import interviewRoutes from './routes/interviewRoutes';
import { connectDatabase } from './config/database';


const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API Routes
app.get('/api', (_req, res) => {
  res.json({
    message: 'Welcome to Immigration Helper API',
    version: '1.0.0',
    endpoints: {
      news: '/api/news',
      visaChat: '/api/visa-chat',
      interview: '/api/interview'
    }
  });
});

// News API routes
app.use('/api/news', newsRoutes);

// Visa Chat RAG routes
app.use('/api/visa-chat', visaChatRoutes);

// AI Interview Practice routes
app.use('/api/interview', interviewRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Connect to Supabase and start server
connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  });
}).catch((error: Error) => {
  console.error('❌ Failed to connect to Supabase:', error);
  process.exit(1);
});

export default app;
