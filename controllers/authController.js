const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid'); // for referral code

// Helper: generate referral code (unique)
function generateReferralCode() {
  return uuidv4().slice(0, 8); // short 8 chars code
}

exports.register = async (req, res) => {
  try {
    const { email, password, referralCode } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prepare user object
    user = new User({
      email,
      password: hashedPassword,
      referralCode: generateReferralCode(),
      isAdmin: email === process.env.ADMIN_EMAIL // admin flag
    });

    // Handle referral
    if (referralCode) {
      const refUser = await User.findOne({ referralCode });
      if (refUser) {
        user.referredBy = referralCode;
        // Add current user as referral to refUser
        refUser.referrals.push(user._id);
        await refUser.save();
      }
    }

    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, msg: 'Registration successful' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, msg: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};
