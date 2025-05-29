const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getProfile } = require('../controllers/userController');

// @route GET /api/user/dashboard
router.get('/dashboard', authenticateToken, getProfile);

module.exports = router;
