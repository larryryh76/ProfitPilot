const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');
const {
  registerUser,
  loginUser
} = require('../controllers/authController');

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// ✅ GET /api/auth/me - Fetch current user data
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
