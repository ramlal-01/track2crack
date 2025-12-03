//UserCoreProgress model definition using Mongoose
const mongoose = require('mongoose');

const userCoreProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coreTopicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoreTopic',
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserCoreProgress', userCoreProgressSchema);
