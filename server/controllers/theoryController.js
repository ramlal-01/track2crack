const TheoryTopic = require('../models/TheoryTopic');
const UserTheoryProgress = require('../models/UserTheoryProgress');


// GET /api/theory/topics?subject=DSA
exports.getTheoryTopicsBySubject = async (req, res) => {
  try {
    const { subject } = req.query;

    if (!subject || !['DSA', 'Java', 'OOPS'].includes(subject)) {
      return res.status(400).json({ message: "Invalid or missing subject" });
    }

    const topics = await TheoryTopic.find({ subject });
    res.status(200).json({ count: topics.length, topics });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch theory topics", error: error.message });
  }
};

// POST /api/theory/progress
exports.updateTheoryProgress = async (req, res) => {
  try {
    const { topicId, isCompleted, isBookmarked, remindOn } = req.body;
    const userId = req.user.userId; // ✅ Extracted from verified token

    if (!userId || !topicId) {
      return res.status(400).json({ message: "userId and topicId are required" });
    }

    const progress = await UserTheoryProgress.findOneAndUpdate(
      { userId, topicId },
      {
        isCompleted: isCompleted ?? false,
        isBookmarked: isBookmarked ?? false,
        remindOn: remindOn ?? null
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Theory topic progress updated", progress });
  } catch (error) {
    res.status(500).json({ message: "Failed to update theory topic progress", error: error.message });
  }
};


// GET /api/theory/progress/:userId
exports.getUserTheoryProgress = async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    const loggedInUserId = req.user.userId; // comes from decoded token

    // 🛡️ Prevent one user from accessing another's data
    if (requestedUserId !== loggedInUserId) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    const progress = await UserTheoryProgress.find({ userId: requestedUserId });

    res.status(200).json({ count: progress.length, progress });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch theory progress", error: error.message });
  }
};
