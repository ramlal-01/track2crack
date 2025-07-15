const UserDSAProgress = require('../models/UserDSAProgress');
const UserCoreProgress = require('../models/UserCoreProgress');
const UserTheoryProgress = require('../models/UserTheoryProgress');

exports.getRecentBookmarks = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [dsa, core, theory] = await Promise.all([
      UserDSAProgress.find({ userId, isBookmarked: true }).populate('questionId').lean(),
      UserCoreProgress.find({ userId, isBookmarked: true }).populate('coreTopicId').lean(),
      UserTheoryProgress.find({ userId, isBookmarked: true }).populate('topicId').lean(),
    ]);

    // 🔥 Filter out corrupted bookmarks (null populated refs)
    const validDsa = dsa.filter((b) => b.questionId);
    const validCore = core.filter((b) => b.coreTopicId);
    const validTheory = theory.filter((b) => b.topicId);

    const all = [...validDsa, ...validCore, ...validTheory];

    const sorted = all.sort((a, b) => {
      if (!a.lastAccessed) return 1;
      if (!b.lastAccessed) return -1;
      return new Date(b.lastAccessed) - new Date(a.lastAccessed);
    });

    res.status(200).json({ bookmarks: sorted });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recent bookmarks", error: error.message });
  }
};
