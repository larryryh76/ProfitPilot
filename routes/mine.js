const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/users/mine
router.post('/users/mine', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.tokens.length === 0) {
      return res.status(400).json({ msg: 'No tokens found. Please create a token first.' });
    }

    const now = Date.now();
    const lastMined = user.lastMined || 0;
    const cooldown = 2 * 60 * 60 * 1000; // 2 hours

    if (now - lastMined < cooldown) {
      const minutesLeft = Math.ceil((cooldown - (now - lastMined)) / 60000);
      return res.status(400).json({ msg: `Please wait ${minutesLeft} more minutes.` });
    }

    const base = 0.7;
    const boost = Math.pow(2, user.boostLevel || 0);
    const income = parseFloat((base * boost).toFixed(2));

    user.income += income;
    user.lastMined = now;
    await user.save();

    res.json({ msg: `Mined $${income}`, income: user.income });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
