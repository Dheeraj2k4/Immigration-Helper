import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Load environment variables
dotenv.config();
import newsRoutes from './routes/newsRoutes';


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
      news: '/api/news'
    }
  });
});

// TODO: Import and use routes here
// import visaRoutes from './routes/visaRoutes';
// app.use('/api/visa', visaRoutes);

// News API routes
app.use('/api/news', newsRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
