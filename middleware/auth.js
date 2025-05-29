const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async function (req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.user.id);
    if (!user) {
      console.log('User not found with ID:', decoded.user.id);
      return res.status(404).json({ msg: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = { authenticateToken };
