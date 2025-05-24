const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// POST /api/users/create-token
router.post('/users/create-token', authMiddleware, async (req, res) => {
  const { name } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (user.tokens.length >= 5) {
      return res.status(400).json({ msg: 'Max 5 tokens allowed' });
    }

    const isFree = user.tokens.length === 0;

    if (!isFree) {
      if (user.income < 5) {
        return res.status(400).json({ msg: 'Insufficient balance to create token ($5 needed)' });
      }
      user.income -= 5;
    }

    const newToken = {
      name,
      performanceData: [],
    };

    user.tokens.push(newToken);
    await user.save();

    res.json({ msg: `Token '${name}' created${isFree ? ' for free' : ' with $5 deduction'}`, tokens: user.tokens });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
