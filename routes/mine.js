const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { mine } = require('../controllers/mineController');

router.post('/', authenticateToken, mine);

module.exports = router;
