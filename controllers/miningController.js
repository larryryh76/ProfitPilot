const User = require('../models/User');

exports.startMining = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (!user.lastMined) {
      user.lastMined = new Date();
      await user.save();
      return res.status(200).json({ msg: 'Mining started', lastMined: user.lastMined });
    } else {
      return res.status(400).json({ msg: 'Mining already started' });
    }
  } catch (error) {
    console.error('Start mining error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMiningStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.status(200).json({
      miningActive: !!user.lastMined,
      lastMined: user.lastMined,
      income: user.income,
      boostMultiplier: user.boostMultiplier,
    });
  } catch (error) {
    console.error('Get mining status error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// NEW boostIncome function
exports.boostIncome = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Simulate payment here (actual payment integration will be done later)
    // For now, assume user pays $3 each boost

    // Double the boostMultiplier
    user.boostMultiplier = user.boostMultiplier * 2;

    // Update income = baseIncome * boostMultiplier
    const baseIncome = 0.7; // base mining income per cycle
    user.income = baseIncome * user.boostMultiplier;

    await user.save();

    res.status(200).json({
      msg: 'Boost successful',
      income: user.income,
      boostMultiplier: user.boostMultiplier,
    });
  } catch (error) {
    console.error('Boost income error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};
