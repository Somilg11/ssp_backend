import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adRequestRoutes from './routes/adRequest';
import dspRoutes from './routes/dsp';
import analyticsRoutes from './routes/analytics'; // Import analytics route

dotenv.config();

const app = express();

// Allow CORS requests from your frontend URL (e.g., http://localhost:3000 for local development)
const corsOptions = {
  origin: 'http://localhost:3000',  // Replace with your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));  // Apply CORS settings
app.use(express.json());
app.use('/ad-request', adRequestRoutes);
app.use('/dsps', dspRoutes);
app.use('/analytics', analyticsRoutes); // Mount the analytics route here

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
