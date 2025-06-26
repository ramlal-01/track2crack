const UserDSAProgress = require('../models/UserDSAProgress');
const UserCoreProgress = require('../models/UserCoreProgress');
const UserTheoryProgress = require('../models/UserTheoryProgress');

exports.getReminderItems = async (req, res) => {
  try {
    const userId = req.params.userId;

    const [dsa, core, theory] = await Promise.all([
      UserDSAProgress.find({ userId, remindOn: { $ne: null } }).populate('questionId'),
      UserCoreProgress.find({ userId, remindOn: { $ne: null } }).populate('coreTopicId'),
      UserTheoryProgress.find({ userId, remindOn: { $ne: null } }).populate('topicId'),
    ]);

    res.status(200).json({
      dsaReminders: dsa,
      coreReminders: core,
      theoryReminders: theory
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reminders", error: error.message });
  }
};
