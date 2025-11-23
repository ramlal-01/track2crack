// Quiz Model - Defines the schema for quizzes taken by users
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source: {
    type: String,
    enum: ['Theory', 'Core'],
    required: true
  },
  subject: {
    type: String,
    enum: ['Java', 'OOPS', 'DSA', 'OS', 'DBMS', 'CN'],
    required: true
  },
  topicsCovered: [String], // <-- make sure this is the exact field
  totalQuestions: Number,
  questions: [
    {
      questionText: String,
      options: [String],
      correctAnswerIndex: Number,
      selectedAnswerIndex: Number
    }
  ],
  score: {
    type: Number,
    required: true
  },
  bookmarkedQuestions: [
    {
      questionText: String,
      topicTag: String,
      bookmarkedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  takenAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', quizSchema);
