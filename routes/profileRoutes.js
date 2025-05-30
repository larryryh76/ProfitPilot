const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getProfile, markNotificationRead, resetIncome } = require('../controllers/profileController');

router.use(authMiddleware);

router.get('/', getProfile);
router.put('/notification/:notificationId/read', markNotificationRead);
router.post('/reset-income', resetIncome);

module.exports = router;
