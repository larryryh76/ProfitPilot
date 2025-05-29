// index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const tokenRoutes = require('./routes/token');
const incomeRoutes = require('./routes/income');
const leaderboardRoutes = require('./routes/leaderboard');
const boostRoutes = require('./routes/boost');
const mineRoutes = require('./routes/mine');
const adminRoutes = require('./routes/admin'); // ✅ Admin route added

// Route usage
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/token', tokenRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/boost', boostRoutes);
app.use('/api/mine', mineRoutes);
app.use('/api/admin', adminRoutes); // ✅ Admin route mounted

// Root route
app.get('/', (req, res) => {
  res.send('🚀 ProfitPilot API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server Error' });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
