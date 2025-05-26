import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Define routes
app.use('/api/auth', (await import('./routes/api/auth.js')).default);
app.use('/api/users', (await import('./routes/api/users.js')).default);
app.use('/api/profiles', (await import('./routes/api/profiles.js')).default);
app.use('/api/jobs', (await import('./routes/api/jobs.js')).default);
app.use('/api/matches', (await import('./routes/api/matches.js')).default);
app.use('/api/documents', (await import('./routes/api/documents.js')).default);

// Basic route
app.get('/', (req, res) => {
  res.send('API Running');
});

// Define PORT
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
