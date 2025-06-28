const Quiz = require('../models/Quiz');
const { fetchMCQsFromGFG } = require('../utils/gfgScraper');
const UserTheoryProgress = require('../models/UserTheoryProgress');
const UserCoreProgress = require('../models/UserCoreProgress');

// POST /api/quiz/generate (🔒 Protected via verifyToken)
exports.generateQuiz = async (req, res) => {
  try {
    const userId = req.user.userId; // token se nikal raha
    const { subject, source } = req.body;

    if (!userId || !subject || !source) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let topicDocs = [];

    if (source === 'Theory') {
      const progress = await UserTheoryProgress.find({ userId, isCompleted: true }).populate('topicId');
      topicDocs = progress.filter(p => p.topicId.subject === subject).map(p => p.topicId);
    } else if (source === 'Core') {
      const progress = await UserCoreProgress.find({ userId, isCompleted: true }).populate('coreTopicId');
      topicDocs = progress
        .filter(p => p.coreTopicId.subject === subject)
        .map(p => ({ title: p.coreTopicId.title }));
    } else {
      return res.status(400).json({ message: "Invalid quiz source type" });
    }

    let allMCQs = [];
    for (const topic of topicDocs) {
      const mcqs = await fetchMCQsFromGFG(topic.title);
      allMCQs.push(...mcqs);
    }

    if (allMCQs.length === 0) {
      return res.status(404).json({ message: "No MCQs found for your studied topics." });
    }

    const final = allMCQs.sort(() => 0.5 - Math.random()).slice(0, 10);

    res.status(200).json({
      subject,
      source,
      topicsCovered: topicDocs.map(t => t.title),
      totalQuestions: final.length,
      questions: final
    });

  } catch (err) {
    res.status(500).json({ message: "Quiz generation failed", error: err.message });
  }
};


// POST /api/quiz/submit (🔒 Protected via verifyToken)
exports.submitQuiz = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { subject, source, questions, bookmarkedQuestions } = req.body;

    if (!subject || !source || !questions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let score = 0;
    for (const q of questions) {
      if (q.selectedAnswerIndex === q.correctAnswerIndex) score++;
    }

    const quiz = new Quiz({
      userId,
      subject,
      source,
      questions,
      score,
      bookmarkedQuestions: (bookmarkedQuestions || []).map(q => ({
        questionText: q.questionText,
        topicTag: q.topicTag,
        bookmarkedAt: new Date()
      }))
    });

    await quiz.save();

    res.status(201).json({ message: "Quiz submitted", score, quizId: quiz._id });

  } catch (error) {
    res.status(500).json({ message: "Quiz submission failed", error: error.message });
  }
};
