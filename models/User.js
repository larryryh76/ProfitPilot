const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  income: { type: Number, default: 0 },                // accumulated income
  boostMultiplier: { type: Number, default: 1 },       // starts at 1x
  lastMined: { type: Date, default: null },

  referralCode: { type: String, unique: true },
  referredBy: { type: String, default: null },
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  isAdmin: { type: Boolean, default: false },

  tokens: [tokenSchema],   // embedded token documents, max 5 tokens enforced in logic
  tokensCreated: { type: Number, default: 0 }, // can keep if useful

  isMining: { type: Boolean, default: false },  // mining started or not

  notifications: [
    {
      message: String,
      read: { type: Boolean, default: false },
      date: { type: Date, default: Date.now }
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
