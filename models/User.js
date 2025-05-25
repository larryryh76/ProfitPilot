const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  performanceData: { type: Array, default: [] }
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  referrals: { type: Number, default: 0 },
  income: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  boostRate: { type: Number, default: 1 },
  totalBoosts: { type: Number, default: 0 },
  tokens: [TokenSchema],
  lastMined: { type: Date },
  joinedAt: { type: Date, default: Date.now },
  registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
