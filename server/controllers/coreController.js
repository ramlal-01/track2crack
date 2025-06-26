const CoreTopic = require('../models/CoreTopic');
const UserCoreProgress = require('../models/UserCoreProgress');


// GET /api/core/topics?subject=OS
exports.getCoreTopicsBySubject = async (req, res) => {
  try {
    const { subject } = req.query;

    if (!subject || !['OS', 'DBMS', 'CN'].includes(subject)) {
      return res.status(400).json({ message: "Invalid or missing subject" });
    }

    const topics = await CoreTopic.find({ subject });

    res.status(200).json({ count: topics.length, topics });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch core topics", error: error.message });
  }
};

// POST /api/core/progress
exports.updateCoreProgress = async (req, res) => {
  try {
    const { userId, coreTopicId, isCompleted, isBookmarked, remindOn } = req.body;

    if (!userId || !coreTopicId) {
      return res.status(400).json({ message: "userId and coreTopicId are required" });
    }

    const progress = await UserCoreProgress.findOneAndUpdate(
      { userId, coreTopicId },
      {
        isCompleted: isCompleted ?? false,
        isBookmarked: isBookmarked ?? false,
        remindOn: remindOn ?? null
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Core topic progress updated", progress });

  } catch (error) {
    res.status(500).json({ message: "Failed to update core topic progress", error: error.message });
  }
};

// GET /api/core/progress/:userId
exports.getUserCoreProgress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const progress = await UserCoreProgress.find({ userId });

    res.status(200).json({ count: progress.length, progress });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch core topic progress", error: error.message });
  }
};