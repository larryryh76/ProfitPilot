const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const tokenRoutes = require('./routes/token');
const mineRoutes = require('./routes/mine');
const boostRoutes = require('./routes/boost');
const leaderboardRoutes = require('./routes/leaderboard');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', authRoutes);
app.use('/api', tokenRoutes);
app.use('/api', mineRoutes);
app.use('/api', boostRoutes);
app.use('/api', leaderboardRoutes);
app.use('/api', adminRoutes);
app.use('/api/users', userRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB Connected');
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Server running on port ${process.env.PORT || 5000}`)
  );
})
.catch(err => console.error(err));
