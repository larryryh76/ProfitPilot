const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const notification = user.notifications.id(notificationId);
    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    notification.read = true;
    await user.save();

    res.status(200).json({ msg: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.resetIncome = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.income = 0.7;               // reset income to starting value
    user.boostMultiplier = 1;        // reset boost multiplier to 1
    await user.save();

    res.status(200).json({ msg: 'Income and boost multiplier reset', income: user.income, boostMultiplier: user.boostMultiplier });
  } catch (error) {
    console.error('Reset income error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};
