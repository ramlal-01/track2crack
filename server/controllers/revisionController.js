const UserDSAProgress = require('../models/UserDSAProgress');
const UserCoreProgress = require('../models/UserCoreProgress');
const UserTheoryProgress = require('../models/UserTheoryProgress');


exports.getReminderItems = async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    const loggedInUserId = req.user.userId;

    // 🛡️ Block access if not same user
    if (requestedUserId !== loggedInUserId) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    const [dsa, core, theory] = await Promise.all([
      UserDSAProgress.find({ userId: requestedUserId, remindOn: { $ne: null } }).populate('questionId','title'),
      UserCoreProgress.find({ userId: requestedUserId, remindOn: { $ne: null } }).populate('coreTopicId','title subject'),
      UserTheoryProgress.find({ userId: requestedUserId, remindOn: { $ne: null } }).populate('topicId','title subject'),
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


const cutoff = new Date(); 
cutoff.setHours(0, 0, 0, 0);// Normalize to start of day

exports.getOverdueReminders = async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    const loggedInUserId = req.user.userId;

    if (requestedUserId !== loggedInUserId) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    const [dsa, core, theory] = await Promise.all([
      UserDSAProgress.find({
        userId: requestedUserId,
        remindOn: { $lt: cutoff }
         
      }).populate('questionId', 'title'),

      UserCoreProgress.find({
        userId: requestedUserId,
        remindOn: { $lt: cutoff }
        
      }).populate('coreTopicId' ,'title subject'),

      UserTheoryProgress.find({
        userId: requestedUserId,
        remindOn: { $lt: cutoff }
         
      }).populate('topicId','title subject')
    ]);

    res.status(200).json({
      count: dsa.length + core.length + theory.length,
      dsa,
      core,
      theory
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch overdue reminders", error: error.message });
  }
};

exports.getTodayReminders = async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    const loggedInUserId = req.user.userId;

    if (requestedUserId !== loggedInUserId) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [dsa, core, theory] = await Promise.all([
      UserDSAProgress.find({
        userId: requestedUserId,
        remindOn: { $gte: startOfDay, $lte: endOfDay }
        
      }).populate('questionId', 'title'),

      UserCoreProgress.find({
        userId: requestedUserId,
        remindOn: { $gte: startOfDay, $lte: endOfDay }
        
      }).populate('coreTopicId','title subject'),

      UserTheoryProgress.find({
        userId: requestedUserId,
        remindOn: { $gte: startOfDay, $lte: endOfDay }
        
      }).populate('topicId','title subject')
    ]);

    res.status(200).json({
      count: dsa.length + core.length + theory.length,
      dsa,
      core,
      theory
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch today reminders", error: error.message });
  }
};


exports.getUpcomingReminders = async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    const loggedInUserId = req.user.userId;

    if (requestedUserId !== loggedInUserId) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    const start = new Date(); // tomorrow 00:00
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + 1);

    const end = new Date(); // 7 days from now 23:59
    end.setHours(23, 59, 59, 999);
    end.setDate(end.getDate() + 7);

    const [dsa, core, theory] = await Promise.all([
      UserDSAProgress.find({
        userId: requestedUserId,
        remindOn: { $gte: start, $lte: end }
        
      }).populate('questionId', 'title'),

      UserCoreProgress.find({
        userId: requestedUserId,
        remindOn: { $gte: start, $lte: end }
        
      }).populate('coreTopicId','title subject'),

      UserTheoryProgress.find({
        userId: requestedUserId,
        remindOn: { $gte: start, $lte: end }
         
      }).populate('topicId','title subject')
    ]);

    res.status(200).json({
      count: dsa.length + core.length + theory.length,
      dsa,
      core,
      theory
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch upcoming reminders", error: error.message });
  }
};


exports.getRemindersByDate = async (req, res) => {
  const { userId: requestedUserId } = req.params;
  const { date } = req.query; // ✅ use query param, not params

  const loggedInUserId = req.user.userId;

  if (requestedUserId !== loggedInUserId) {
    return res.status(403).json({ message: "Forbidden: Access denied" });
  }

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const [dsa, core, theory] = await Promise.all([
    UserDSAProgress.find({
      userId: requestedUserId,
      remindOn: { $gte: start, $lte: end }
     
    }).populate('questionId'),

    UserCoreProgress.find({
      userId: requestedUserId,
      remindOn: { $gte: start, $lte: end }
      
    }).populate('coreTopicId'),

    UserTheoryProgress.find({
      userId: requestedUserId,
      remindOn: { $gte: start, $lte: end }
      
    }).populate('topicId')
  ]);

  res.status(200).json({
    date,
    count: dsa.length + core.length + theory.length,
    dsa,
    core,
    theory
  });
};


exports.updateReminder = async (req, res) => {
  try {
    const reminderId = req.params.id;
    const { action, newDate } = req.body;
    const loggedInUserId = req.user.userId;

    let models = [
      { model: UserDSAProgress, field: 'questionId' },
      { model: UserCoreProgress, field: 'coreTopicId' },
      { model: UserTheoryProgress, field: 'topicId' }
    ];

    let updated = null;

    for (let { model } of models) {
      const doc = await model.findOne({ _id: reminderId, userId: loggedInUserId });
      if (!doc) continue;

      if (action === "complete") {
        doc.isCompleted = true;
        doc.remindOn = null;
      } else if (action === "reschedule" && newDate===null) {
        doc.remindOn = null;
      } else {
        return res.status(400).json({ message: "Invalid action or missing newDate" });
      }

      updated = await doc.save();
      break;
    }

    if (!updated) {
      return res.status(404).json({ message: "Reminder not found for user" });
    }

    res.status(200).json({ message: "Reminder updated successfully", updated });

  } catch (error) {
    res.status(500).json({ message: "Failed to update reminder", error: error.message });
  }
};


exports.addReminder = async (req, res) => {
  try {
    const { type, itemId, date } = req.body;
    const userId = req.user.userId;

    if (!["dsa", "core", "theory"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    if (!itemId || !date) {
      return res.status(400).json({ message: "Missing itemId or date" });
    }

    let model;
    let query;

    switch (type) {
      case "dsa":
        model = UserDSAProgress;
        query = { userId, questionId: itemId };
        break;
      case "core":
        model = UserCoreProgress;
        query = { userId, coreTopicId: itemId };
        break;
      case "theory":
        model = UserTheoryProgress;
        query = { userId, topicId: itemId };
        break;
    }

    const progressDoc = await model.findOne(query);

    if (!progressDoc) {
      return res.status(404).json({ message: "Progress not found for item" });
    }

    progressDoc.remindOn = date;
    await progressDoc.save();

    res.status(200).json({ message: "Reminder set successfully", updated: progressDoc });

  } catch (error) {
    res.status(500).json({ message: "Failed to set reminder", error: error.message });
  }
};
