const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const TWO_HOURS = 2 * 60 * 60 * 1000;

// GET /api/mine
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (user.tokens.length === 0) {
      return res.status(400).json({ msg: 'Create at least one token to start mining' });
    }

    const now = Date.now();
    const lastMined = user.lastMined || 0;

    if (now - lastMined < TWO_HOURS) {
      const minutesLeft = Math.ceil((TWO_HOURS - (now - lastMined)) / 60000);
      return res.status(400).json({ msg: `Please wait ${minutesLeft} minutes before mining again` });
    }

    const base = 0.7;
    const boost = user.boostRate || 1;
    const earned = base * boost;

    user.income += earned;
    user.lastMined = now;
    await user.save();

    res.json({ msg: `Mined $${earned.toFixed(2)} successfully`, income: user.income });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
