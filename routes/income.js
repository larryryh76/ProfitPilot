const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { mineIncome, getIncome } = require('../controllers/incomeController');

router.post('/mine', authenticateToken, mineIncome);
router.get('/', authenticateToken, getIncome);

module.exports = router;
