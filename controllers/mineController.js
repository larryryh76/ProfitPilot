const User = require('../models/User');

exports.mine = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const now = Date.now();
    const lastMined = user.lastMined || 0;
    const TWO_HOURS = 1000 * 60 * 60 * 2;

    if (now - lastMined < TWO_HOURS) {
      const wait = Math.ceil((TWO_HOURS - (now - lastMined)) / 60000);
      return res.status(400).json({ msg: `Please wait ${wait} more minutes before mining again.` });
    }

    const baseIncome = 0.7;
    const multiplier = user.boostMultiplier || 1;
    const earned = baseIncome * multiplier;

    user.income += earned;
    user.lastMined = now;

    await user.save();
    res.json({ msg: `Successfully mined $${earned.toFixed(2)}!`, income: user.income });
  } catch (err) {
    console.error('Mining error:', err.message);
    res.status(500).send('Server error');
  }
};
