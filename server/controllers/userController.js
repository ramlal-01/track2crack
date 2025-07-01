const DSAProgress = require('../models/UserDSAProgress');
const CoreProgress = require('../models/UserCoreProgress');
const TheoryProgress = require('../models/UserTheoryProgress');
const Quiz = require('../models/Quiz');

exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.params.userId;

    const [dsa, core, theory, quiz] = await Promise.all([
      DSAProgress.findOne({ userId }),
      CoreProgress.findOne({ userId }),
      TheoryProgress.findOne({ userId }),
      Quiz.find({ userId }).sort({ takenAt: -1 }).limit(5)
    ]);

    return res.status(200).json({
      dsaProgress: dsa || {},
      coreProgress: core || {},
      theoryProgress: theory || {},
      quizHistory: quiz || []
    });
  } catch (err) {
    console.error('Dashboard Fetch Error:', err);
    res.status(500).json({ message: 'Server Error: Failed to fetch dashboard data' });
  }
};
