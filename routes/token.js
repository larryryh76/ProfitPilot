const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Create a new token
router.post('/token', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (!user.tokens) user.tokens = [];

    if (user.tokens.length >= 5) {
      return res.status(400).json({ msg: 'You can only create up to 5 tokens.' });
    }

    if (user.tokens.length >= 1) {
      user.income = (user.income || 0) - 5; // Simulated $5 for extra tokens
    }

    const newToken = {
      name: req.body.name,
      createdAt: new Date(),
      performance: [0]
    };

    user.tokens.push(newToken);
    await user.save();

    res.json(user.tokens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
