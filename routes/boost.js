const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// POST /api/users/boost
router.post('/users/boost', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Simulate a $3 boost payment (future Paystack/Stripe integration)
    user.boostRate *= 2;
    user.totalBoosts += 1;

    await user.save();

    res.json({
      msg: 'Boost applied successfully',
      newBoostRate: user.boostRate,
      note: 'This is a simulated payment. Real payment integration coming soon.',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
