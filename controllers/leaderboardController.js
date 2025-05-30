const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
  try {
    // Sort users by boostMultiplier descending, limit top 10
    const topUsers = await User.find()
      .sort({ boostMultiplier: -1 })
      .limit(10)
      .select('email boostMultiplier income tokensCreated');

    res.status(200).json(topUsers);
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};
