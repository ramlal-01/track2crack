const mongoose = require('mongoose');

const theoryTopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    enum: ['Java', 'OOPS', 'DSA'],
    required: true
  },
  content: {
    type: String // optional written explanation
  },
  tags: [String], // optional keywords
  videoLink: {
    type: String // optional YouTube video
  },
  articleLinks: [String], // optional multiple GFG/W3 links
}, {
  timestamps: true // ✅ adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('TheoryTopic', theoryTopicSchema);
