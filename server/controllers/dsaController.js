const DSAQuestion = require('../models/DSAQuestion');
const UserDSAProgress = require('../models/UserDSAProgress');
// GET /api/dsa/questions
exports.getAllDSAQuestions = async (req, res) => {
  try {
    const questions = await DSAQuestion.find();
    res.status(200).json({ count: questions.length, questions });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch DSA questions", error: error.message });
  }
};

// POST /api/dsa/progress
exports.updateDSAProgress = async (req, res) => {
  try {
    const { questionId, isCompleted, isBookmarked, remindOn } = req.body;
    const userId = req.user.userId; // 🔒 Use verified token userId only
    
    if (!userId || !questionId) {
      return res.status(400).json({ message: "userId and questionId are required" });
    }

    const progress = await UserDSAProgress.findOneAndUpdate(
      { userId, questionId },
      {
        isCompleted: isCompleted ?? false,
        isBookmarked: isBookmarked ?? false,
        remindOn: remindOn ?? null
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Progress updated", progress });

  } catch (error) {
    res.status(500).json({ message: "Failed to update progress", error: error.message });
  }
};


// GET /api/dsa/progress/:userId
exports.getUserDSAProgress = async (req, res) => { 

  try {
    const requestedUserId = req.params.userId;
    const loggedInUserId = req.user.userId; // ✅ FIXED here

    if (requestedUserId !== loggedInUserId) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    const progress = await UserDSAProgress.find({ userId: requestedUserId });

    res.status(200).json({ count: progress.length, progress });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch DSA progress", error: error.message });
  }
};
