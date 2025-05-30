const User = require('../models/User');

exports.createToken = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ msg: 'Token name is required' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check token limit
    if (user.tokens.length >= 5) {
      return res.status(400).json({ msg: 'Maximum of 5 tokens allowed' });
    }

    // TODO: Check if user must pay $5 to create token after the first
    // For now, just proceed

    // Check if token name already exists for user
    if (user.tokens.some(t => t.name.toLowerCase() === name.toLowerCase())) {
      return res.status(400).json({ msg: 'Token with this name already exists' });
    }

    user.tokens.push({ name });

    await user.save();

    return res.status(201).json({ msg: 'Token created', tokens: user.tokens });
  } catch (error) {
    console.error('Create token error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};
