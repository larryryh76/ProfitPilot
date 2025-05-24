const express = require('express');
const userRoutes = require('./routes/user');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewa56r
app.use(cors());
app.use(express.json());
app.use('/api', require('./routes/token'));
app.use('/api', require('./routes/mine'));
app.use('/api', require('./routes/admin'));
app.use('/api', require('./routes/leaderboard'));
app.use('/api', require('./routes/boost'));
app.use('/api/users', userRoutes);
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);
// Routes (placeholders for now)
app.get("/", (req, res) => {
  res.send("ProfitPilot backend is running!");
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");
}).catch((err) => {
  console.error("MongoDB Connection Error:", err);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
