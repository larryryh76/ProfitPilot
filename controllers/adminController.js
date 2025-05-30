const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('referrals', 'email');
    res.status(200).json(users);
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.promoteUserToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.isAdmin = true;
    await user.save();

    res.status(200).json({ msg: `User ${user.email} promoted to admin` });
  } catch (error) {
    console.error('Admin promote user error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) return res.status(404).json({ msg: 'User not found' });

    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};
