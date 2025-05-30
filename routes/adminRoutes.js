const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllUsers,
  promoteUserToAdmin,
  deleteUser,
} = require('../controllers/adminController');

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/users', getAllUsers);
router.put('/promote/:userId', promoteUserToAdmin);
router.delete('/user/:userId', deleteUser);

module.exports = router;
