const express = require('express');
const router = express.Router();
const { createToken } = require('../controllers/tokenController');
const authMiddleware = require('../middleware/authMiddleware'); // JWT verify

router.post('/create', authMiddleware, createToken);

module.exports = router;
