const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  performanceData: [
    {
      value: { type: Number, default: 0 },
      date: { type: Date, default: Date.now }
    }
  ]
});

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Tokens the user has created
  tokens: [tokenSchema],

  // Mining income and boost tracking
  income: { type: Number, default: 0.7 },
  boostLevel: { type: Number, default: 0 },

  // Referrals
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  referralCode: { type: String, unique: true },     // Unique code for inviting others
  referredBy: { type: String, default: null },       // Code of the person who referred this user

  // Admin privileges
  isAdmin: { type: Boolean, default: false },

  // Metadata
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
