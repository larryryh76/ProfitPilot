const express = require('express');
const router = express.Router();
const { startMining, getMiningStatus, boostIncome } = require('../controllers/miningController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/start', authMiddleware, startMining);
router.get('/status', authMiddleware, getMiningStatus);
router.post('/boost', authMiddleware, boostIncome);  // <-- New boost route

module.exports = router;
