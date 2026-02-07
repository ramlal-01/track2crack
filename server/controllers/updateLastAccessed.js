//updateLastAccessed - Updates the last accessed timestamp for DSA questions, core topics, or theory topics based on user activity.
const UserDSAProgress = require('../models/UserDSAProgress');
const UserCoreProgress = require('../models/UserCoreProgress');
const UserTheoryProgress = require('../models/UserTheoryProgress');

exports.updateLastAccessed = async (req, res) => {
  try {
    const { itemType, itemId } = req.body;
    const userId = req.user.userId;

    let model, query;

    switch (itemType) {
      case 'dsa':
        model = UserDSAProgress;
        query = { userId, questionId: itemId };
        break;
      case 'core':
        model = UserCoreProgress;
        query = { userId, coreTopicId: itemId };
        break;
      case 'theory':
        model = UserTheoryProgress;
        query = { userId, topicId: itemId };
        break;
      default:
        return res.status(400).json({ message: "Invalid item type" });
    }

    await model.findOneAndUpdate(query, {
      $set: { lastAccessed: new Date() }
    });

    res.status(200).json({ message: "Last accessed updated" });

  } catch (error) {
    res.status(500).json({ message: "Failed to update last accessed", error: error.message });
  }
};
