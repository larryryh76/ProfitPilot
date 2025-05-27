const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

// Register route
router.post('/register', async (req, res) => {
  const { email, password, referredBy } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email,
      password: hashedPassword,
      referredBy: referredBy || null,
    });

    await user.save();

    // Handle referral bonus
    let referrerInfo = null;
    if (referredBy && mongoose.Types.ObjectId.isValid(referredBy)) {
      const referrer = await User.findById(referredBy);
      if (referrer) {
        referrer.income += 2;
        referrer.referrals = (referrer.referrals || 0) + 1;
        await referrer.save();
        referrerInfo = { id: referrer._id, email: referrer.email };
      }
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        referredBy: referrerInfo,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        referredBy: user.referredBy,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
