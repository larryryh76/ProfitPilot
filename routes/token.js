const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create Token Route
router.post('/users/create-token', auth, async (req, res) => {
  const { name } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (user.tokens.length >= 5) {
      return res.status(400).json({ msg: 'Token limit reached' });
    }

    const isFree = user.tokens.length === 0;

    const newToken = {
      name,
      performanceData: [],
    };

    user.tokens.push(newToken);
    if (!isFree) user.income -= 5;

    await user.save();
    res.json({ msg: `Token '${name}' created${isFree ? ' for free' : ''}`, tokens: user.tokens });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
