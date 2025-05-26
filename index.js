const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import route files
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const tokenRoutes = require('./routes/token');
const mineRoutes = require('./routes/mine');
const boostRoutes = require('./routes/boost');
const leaderboardRoutes = require('./routes/leaderboard');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Route Mounts
app.use('/api/auth', authRoutes);           // /api/auth/register, /api/auth/login
app.use('/api/users', userRoutes);          // /api/users/...
app.use('/api/tokens', tokenRoutes);        // /api/tokens/...
app.use('/api/mine', mineRoutes);           // /api/mine/...
app.use('/api/boost', boostRoutes);         // /api/boost/...
app.use('/api/leaderboard', leaderboardRoutes); // /api/leaderboard/...
app.use('/api/admin', adminRoutes);         // /api/admin/...

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB Connected');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => console.error('MongoDB connection failed:', err));
