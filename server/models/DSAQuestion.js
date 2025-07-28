// models/DSAQuestion.js
const mongoose = require('mongoose');

const dsaQuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ['LeetCode', 'GFG', 'CodeStudio', 'Other'],
    default: 'LeetCode'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  topic: {
    type: String,
    required: true
  } 
});

module.exports = mongoose.model('DSAQuestion', dsaQuestionSchema);
