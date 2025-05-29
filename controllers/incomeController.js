const User = require('../models/User');

const EARNING_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const BASE_INCOME = 0.7;

exports.mineIncome = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const now = Date.now();
    const lastMined = user.lastMined || 0;

    if (now - lastMined >= EARNING_INTERVAL) {
      const incomeToAdd = BASE_INCOME * user.boostMultiplier;
      user.income += incomeToAdd;
      user.lastMined = now;

      await user.save();
      return res.json({
        msg: `Income mined: $${incomeToAdd.toFixed(2)}`,
        income: user.income.toFixed(2),
        boostMultiplier: user.boostMultiplier,
        nextEligible: new Date(now + EARNING_INTERVAL),
      });
    } else {
      const remaining = EARNING_INTERVAL - (now - lastMined);
      return res.status(400).json({
        msg: 'Too early to mine again',
        nextEligibleInMs: remaining,
        nextEligible: new Date(lastMined + EARNING_INTERVAL),
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getIncome = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('income boostMultiplier lastMined');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({
      income: user.income.toFixed(2),
      boostMultiplier: user.boostMultiplier,
      lastMined: user.lastMined,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
