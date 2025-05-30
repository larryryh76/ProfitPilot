module.exports = function (req, res, next) {
  if (!req.userDetails?.isAdmin) {
    return res.status(403).json({ msg: 'Admin access required' });
  }
  next();
};
