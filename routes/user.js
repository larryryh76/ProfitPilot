const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// POST /api/users/create-token
router.post('/create-token', auth, async (req, res) => {
  const { name } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (user.tokens.length >= 5) {
      return res.status(400).json({ msg: 'Token limit reached (5 max)' });
    }

    const isFree = user.tokens.length === 0;
    const cost = isFree ? 0 : 5;

    if (!isFree && user.income < cost) {
      return res.status(400).json({ msg: 'Insufficient income to create token' });
    }

    const newToken = {
      name,
      performanceData: [],
    };

    user.tokens.push(newToken);
    user.income -= cost;
    await user.save();

    res.json({
      msg: `Token '${name}' created ${isFree ? 'for free' : `for $${cost}`}`,
      tokens: user.tokens,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/users/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Countdown logic (withdraw unlocks 6 months after June 6, 2025)
    const countdownStart = new Date('2025-06-06T00:00:00Z');
    const now = new Date();

    let countdown = null;
    let withdrawEnabled = false;

    if (now >= countdownStart) {
      const sixMonthsLater = new Date(countdownStart);
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

      const remaining = sixMonthsLater - now;
      countdown = remaining > 0 ? remaining : 0;
      withdrawEnabled = remaining <= 0;
    }

    res.json({
      email: user.email,
      income: user.income,
      boostRate: user.boostRate,
      referrals: user.referrals,
      tokens: user.tokens,
      createdAt: user.createdAt,
      countdown,
      withdrawEnabled
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
