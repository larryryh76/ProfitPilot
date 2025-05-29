// controllers/boostController.js
const User = require('../models/User');

exports.boost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Fix: default to 1 if boostMultiplier is undefined/null
    user.boostMultiplier = (user.boostMultiplier || 1) * 2;

    await user.save();

    res.json({
      msg: 'Boost successful! Income multiplier doubled.',
      boostMultiplier: user.boostMultiplier
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
