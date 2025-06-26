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
    type: String
  },
  tags: [String],
  videoLink: String,
  articleLinks: [String]
}, {
  timestamps: true // auto adds and updates createdAt, updatedAt
});
