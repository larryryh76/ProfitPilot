const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  performance: [
    {
      timestamp: { type: Date, default: Date.now },
      value: { type: Number, default: 1 },
    }
  ]
});

module.exports = mongoose.model('Token', tokenSchema);
