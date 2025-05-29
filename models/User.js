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
  tokens: [tokenSchema],
  income: { type: Number, default: 0.7 },
  boostLevel: { type: Number, default: 0 }, // Increases with each $3 payment
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
