// controllers/leaderboardController.js
const Token = require('../models/Token');
const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
  try {
    const topTokens = await Token.find()
      .sort({ boostLevel: -1 }) // or sort by income, if desired
      .limit(10)
      .populate('user', 'username email') // include user info
      .select('name income boostLevel user'); // include only relevant fields

    res.json(topTokens);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
