const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// POST /api/users/mine
router.post('/users/mine', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const now = new Date();
    const lastMined = user.lastMinedAt || new Date(0);
    const hoursPassed = (now - lastMined) / (1000 * 60 * 60);

    if (hoursPassed < 2) {
      const nextTime = new Date(lastMined.getTime() + 2 * 60 * 60 * 1000);
      return res.status(400).json({
        msg: 'Too early to mine again.',
        nextAvailableAt: nextTime.toISOString()
      });
    }

    const baseIncome = 0.70;
    const earned = baseIncome * user.boostRate;

    user.balance += earned;
    user.lastMinedAt = now;
    await user.save();

    res.json({ msg: `Mined $${earned.toFixed(2)}`, balance: user.balance });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
