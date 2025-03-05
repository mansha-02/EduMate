import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { aiRateLimiter } from './services/aiService.js';
import dotenv from 'dotenv';
import curateResourcesRouter from './routes/curateResources.js';
import generatePlanRouter from './routes/generatePlan.js';
import pdfChatRouter from './routes/pdfChat.js';
import rateLimit from 'express-rate-limit';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Ensure required directories exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!existsSync(uploadsDir)) {
  await mkdir(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'x-user-id', 'X-User-Id'],
}));

app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Apply rate limiter to AI-related routes
app.use('/api/resources', aiRateLimiter);
app.use('/api/study-plan', aiRateLimiter);

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiter to all routes
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1;
  res.json({ 
    status: 'ok',
    message: 'Mind Mentor API is running',
    database: dbStatus ? 'connected' : 'disconnected'
  });
});

// Basic health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Mind Mentor API is running' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Apply routes directly without auth middleware
app.use('/generate-plan', generatePlanRouter);
app.use('/curate-resources', curateResourcesRouter);
app.use('/pdf', pdfChatRouter);

// Error handling middleware
app.use((err, req, res) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    error: err.message || 'Something went wrong!' 
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port} in ${process.env.NODE_ENV} mode`);
});