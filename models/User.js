const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  name: String,
  performanceData: [Number],
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tokens: { type: [TokenSchema], default: [] },
  income: { type: Number, default: 0 },
  boostRate: { type: Number, default: 1 },
  ethPaid: { type: Number, default: 0 },
  referrals: { type: Number, default: 0 },
  referredBy: { type: String, default: "" },
  isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", UserSchema);
