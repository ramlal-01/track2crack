// UserTheoryProgress model definition using Mongoose
const mongoose = require('mongoose');

const userTheoryProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TheoryTopic',
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
  lastAccessed: {
    type: Date,
    default: null
  },
  note: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserTheoryProgress', userTheoryProgressSchema);
