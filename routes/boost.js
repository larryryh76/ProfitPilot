const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/users/boost', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Simulate $3 payment
    user.income = user.income * 2;
    user.boostCount = (user.boostCount || 0) + 1;

    await user.save();
    res.json({ msg: 'Boost applied successfully', newBoostRate: user.boostCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
