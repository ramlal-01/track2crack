// CoreTopic Model - Defines the schema for core topics in subjects like OS, DBMS, CN
const mongoose = require('mongoose');

const coreTopicSchema = new mongoose.Schema({
  subject: {
    type: String,
    enum: ['OS', 'DBMS', 'CN'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Important', 'Other'],
    required: true
  },
  resources: [
    {
      label: String, // e.g., "Deadlock GFG", "Deadlock YT", "Notes PDF"
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
    type: String // quick revision notes (optional plain text)
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  order: { type: Number, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('CoreTopic', coreTopicSchema);
