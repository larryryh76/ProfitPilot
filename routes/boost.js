const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// POST /api/boost
router.post('/boost', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    const currentBoost = user.boostRate || 1;
    const newBoost = currentBoost * 2;

    user.boostRate = newBoost;
    user.ethPaid += 3;

    await user.save();

    res.json({
      msg: 'Boost applied successfully',
      newBoostRate: user.boostRate,
      ethPaid: user.ethPaid
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
