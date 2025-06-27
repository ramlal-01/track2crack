exports.getReminderItems = async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    const loggedInUserId = req.user.userId;

    // 🛡️ Block access if not same user
    if (requestedUserId !== loggedInUserId) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    const [dsa, core, theory] = await Promise.all([
      UserDSAProgress.find({ userId: requestedUserId, remindOn: { $ne: null } }).populate('questionId'),
      UserCoreProgress.find({ userId: requestedUserId, remindOn: { $ne: null } }).populate('coreTopicId'),
      UserTheoryProgress.find({ userId: requestedUserId, remindOn: { $ne: null } }).populate('topicId'),
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
