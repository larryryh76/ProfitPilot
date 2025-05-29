const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

exports.registerUser = async (req, res) => {
  const { email, password, referralCode } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Generate unique referral code for new user
    const newReferralCode = uuidv4().slice(0, 8); // Shorter code (e.g., 'a1b2c3d4')

    const newUser = new User({
      email,
      password: hashed,
      income: 0.7,
      referralCode: newReferralCode
    });

    // ✅ Handle referral if valid referralCode is provided
    if (referralCode) {
      const referrerUser = await User.findOne({ referralCode });

      if (referrerUser) {
        // Reward referrer and track referral
        referrerUser.income += 2;
        newUser.referredBy = referrerUser.referralCode;
        await referrerUser.save();
      }
    }

    await newUser.save();

    const payload = { user: { id: newUser.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server error');
  }
};
