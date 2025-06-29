const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  subject: {
    type: String,
    enum: ['Java', 'OOPS', 'DSA', 'OS', 'DBMS', 'CN'],
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  correctAnswerIndex: {
    type: Number,
    required: true
  },
  explanation: {
    type: String // Optional, good for review later
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
});

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
