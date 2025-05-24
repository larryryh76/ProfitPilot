const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Middleware to check admin access
const requireAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user || user.email !== 'larryryh76@gmail.com') {
    return res.status(403).json({ msg: 'Access denied' });
  }
  next();
};

// GET all users
router.get('/admin/users', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /admin/reward — manually add reward
router.post('/admin/reward', authMiddleware, requireAdmin, async (req, res) => {
  const { userId, amount } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.income += amount;
    await user.save();

    res.json({ msg: 'Reward sent', income: user.income });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
