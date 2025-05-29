const Token = require('../models/Token');
const User = require('../models/User');

exports.createToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const existingTokens = await Token.find({ user: req.user.id });

    if (existingTokens.length >= 5) {
      return res.status(400).json({ msg: 'Token limit (5) reached' });
    }

    const isFirstFree = existingTokens.length === 0;
    if (!isFirstFree) {
      // Future integration: Charge $5 for each extra token
      return res.status(402).json({ msg: 'Token creation requires $5 payment' });
    }

    const newToken = new Token({
      user: req.user.id,
      name: req.body.name,
      performance: [{ value: 1 }]
    });

    await newToken.save();
    res.json({ msg: 'Token created', token: newToken });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getTokens = async (req, res) => {
  try {
    const tokens = await Token.find({ user: req.user.id });
    res.json(tokens);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
