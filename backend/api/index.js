require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');
const authRoutes = require('../routes/authRoutes');
const categoryRoutes = require('../routes/categoryRoutes');
const uploadRoutes = require('../routes/uploadRoutes');
const blogRoutes = require('../routes/blogRoutes');
const settingsRoutes = require('../routes/settingsRoutes');
const founderRoutes = require('../routes/founderRoutes');
const contactRoutes = require('../routes/contactRoutes');
const profileRoutes = require('../routes/profileRoutes');
const dashboardRoutes = require('../routes/dashboardRoutes');

// connectDB will be called in middleware for Vercel support

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

// Ensure Database is connected before handling any route (Crucial for Vercel Serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('DB Connection Error in Middleware:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/founder', founderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Base route to check if server is running
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Estate-US Backend API is running perfectly!' });
});

// Vercel Serverless Function expects the app to be exported
module.exports = app;

// Local development server (Only starts if not deployed on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
