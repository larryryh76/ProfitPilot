const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { boost } = require('../controllers/boostController');

router.post('/', authenticateToken, boost);

module.exports = router;
