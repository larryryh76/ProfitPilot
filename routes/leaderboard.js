const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/boosts/leaderboard
router.get('/boosts/leaderboard', async (req, res) => {
  try {
    const users = await User.find().sort({ boostRate: -1, ethPaid: -1 }).limit(20);

    const leaderboard = users.map(user => ({
      email: user.email,
      boostRate: user.boostRate,
      ethPaid: user.ethPaid
    }));

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
