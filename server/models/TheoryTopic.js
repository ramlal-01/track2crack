const mongoose = require('mongoose');

const theoryTopicSchema = new mongoose.Schema({
  subject: {
    type: String,
    enum: ['Java', 'OOPS', 'DSA'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  resources: [
    {
      label: String, // e.g., "Encapsulation GFG", "Abstraction YT", "PDF Notes"
      url: String,
      type: {
        type: String,
        enum: ['article', 'video', 'pdf', 'doc', 'other'],
        default: 'other'
      }
    }
  ],
  studyNoteFiles: [
    {
      fileName: String,
      fileUrl: String
    }
  ],
  notes: {
    type: String // optional plain text notes for revision
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  order: { type: Number, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('TheoryTopic', theoryTopicSchema);
