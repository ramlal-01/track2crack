const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastActivityDate: {
    type: Date,
    required: true,
  },
  count: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model('Streak', streakSchema);
