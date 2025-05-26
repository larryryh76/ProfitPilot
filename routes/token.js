const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST /api/token
// @desc    Create a new token
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ msg: 'Token name is required' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Check if token with same name exists
    const tokenExists = user.tokens.some(t => t.name.toLowerCase() === name.toLowerCase());
    if (tokenExists) {
      return res.status(400).json({ msg: 'Token name already exists' });
    }

    // Check if user can create token
    const isFree = user.tokens.length === 0;
    if (user.tokens.length >= 5) {
      return res.status(400).json({ msg: 'Token limit reached (max 5)' });
    }

    if (!isFree && user.income < 5) {
      return res.status(400).json({ msg: 'Insufficient income to create token' });
    }

    // Deduct $5 if it's not the free one
    if (!isFree) {
      user.income -= 5;
    }

    // Add token
    user.tokens.push({
      name,
      performanceData: [{ value: 0, date: new Date() }]
    });

    await user.save();
    res.json({ msg: 'Token created successfully', tokens: user.tokens });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/token
// @desc    Get all tokens for current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user.tokens);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
