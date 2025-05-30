require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const miningRoutes = require('./routes/miningRoutes');
const adminRoutes = require('./routes/adminRoutes');
const profileRoutes = require('./routes/profileRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

const { startMiningJob } = require('./jobs/autoMineJob');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/mining', miningRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Connect DB & start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(` 🚀 Server running on port ${PORT}`));
    console.log('✅ MongoDB connected');

    // Start the mining background job
    startMiningJob();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
