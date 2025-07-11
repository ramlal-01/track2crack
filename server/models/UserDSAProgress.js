// models/UserDSAProgress.js
const mongoose = require('mongoose');

const userDSAProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DSAQuestion',
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isBookmarked: {
    type: Boolean,
    default: false
  },
  remindOn: {
    type: Date,
    default: null
  },
  note: {
    type: String,
    default: ""
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('UserDSAProgress', userDSAProgressSchema);
