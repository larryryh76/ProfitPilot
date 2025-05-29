// controllers/userController.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, referredBy } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const referralCode = crypto.randomBytes(4).toString("hex");
    const user = await User.create({ name, email, password, referralCode, referredBy });

    // Reward referrer
    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy });
      if (referrer) {
        referrer.income += 2;
        referrer.referrals.push(email);
        await referrer.save();
      }
    }

    res.json({ token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ message: "Register error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  const { name, email, income, boostMultiplier, referralCode, referrals, tokens } = req.user;
  res.json({ name, email, income, boostMultiplier, referralCode, referrals, tokens });
};
