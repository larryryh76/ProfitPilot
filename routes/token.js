const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth'); // ✅ Corrected
const { createToken, getTokens } = require('../controllers/tokenController');

router.post('/', authenticateToken, createToken); // ✅ Corrected
router.get('/', authenticateToken, getTokens);    // ✅ Corrected

module.exports = router;
