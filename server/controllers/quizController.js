// Imports
const Quiz = require('../models/Quiz');
const QuizQuestion = require('../models/QuizQuestion');
const CoreTopic = require('../models/CoreTopic');
const TheoryTopic = require('../models/TheoryTopic');


/**
 * @route   POST /api/quiz/generate
 * @access  Protected (token required)
 * @desc    Generates a quiz from selected topics (max 10 questions)
 */
exports.generateQuiz = async (req, res) => {
  try {
    const { subject, topics, source } = req.body;

    if (!subject || !Array.isArray(topics) || !topics.length || !source) {
      return res.status(400).json({ message: "Subject, topics and source are required" });
    }

    // Fetch questions matching subject and topic list
    const allMCQs = await QuizQuestion.find({
      subject,
      topic: { $in: topics }
    });

    if (allMCQs.length === 0) {
      return res.status(404).json({ message: "No MCQs found for selected topics." });
    }

    // Randomly pick up to 10 questions
    const selected = allMCQs
      .sort(() => 0.5 - Math.random())
      .slice(0, 10)
      .map(q => ({
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        topicTag: q.topic
      }));

    res.status(200).json({
      subject,
      source,
      topicsCovered: topics,
      totalQuestions: selected.length,
      questions: selected
    });

  } catch (err) {
    console.error("Error generating quiz:", err);
    res.status(500).json({ message: "Quiz generation failed", error: err.message });
  }
};

/**
 * @route   POST /api/quiz/submit
 * @access  Protected (token required)
 * @desc    Submits the user's quiz attempt and saves it to DB
 */
exports.submitQuiz = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { subject, source, questions, bookmarkedQuestions, topics } = req.body;

    if (!subject || !source || !questions || !Array.isArray(topics) || !topics.length) {
      return res.status(400).json({ message: "Subject, source, topics, and questions are required" });
    }

    // Calculate total score
    let score = 0;
    for (const q of questions) {
      if (q.selectedAnswerIndex === q.correctAnswerIndex) score++;
    }

    // Save attempt
    const quiz = new Quiz({
      userId,
      subject,
      source,
      topicsCovered: topics,
      totalQuestions: questions.length,
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
    console.error("Error submitting quiz:", error);
    res.status(500).json({ message: "Quiz submission failed", error: error.message });
  }
};


/**
 * @route   GET /api/quiz/history
 * @access  Protected (token required)
 * @desc    Fetches filtered or recent quiz attempts for dashboard/subject page
 */
exports.getQuizHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { subject, limit } = req.query;

    const filter = { userId };
    if (subject) {
      filter.subject = subject;
    }

    const quizzes = await Quiz.find(filter)
      .sort({ takenAt: -1 }) // most recent first
      .limit(Number(limit) || 0) // if no limit, fetch all
      .select('subject source topicsCovered score takenAt totalQuestions');

    res.status(200).json({ quizzes });
  } catch (err) {
    console.error("Error fetching quiz history:", err);
    res.status(500).json({ message: "Failed to load quiz history", error: err.message });
  }
};



exports.getRecentQuizzes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const quizzes = await Quiz.find({ userId })
      .sort({ takenAt: -1 })
      .limit(5)
      .select('subject source topicsCovered score takenAt totalQuestions');
    res.status(200).json(quizzes);
  } catch (err) {
    // error handling
     console.error("Error fetching recent quizzes:", err);
    res.status(500).json({ message: "Failed to load recent quizzes", error: err.message });
  }
};



exports.getQuizBasedProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { subject, source } = req.query;

    if (!subject || !source) {
      return res.status(400).json({ message: "Subject and source are required." });
    }

    const topicModel = source === 'Theory' ? TheoryTopic : CoreTopic;
    const topics = await topicModel.find({ subject }).select('title');

    if (!topics.length) {
      return res.status(404).json({ message: "No topics found for this subject." });
    }

    const topicTitles = topics.map(t => t.title); // using 'title' not 'name'
    const quizzes = await Quiz.find({ userId, subject, source });

    // Track highest score per topic
    const highestScores = {}; // topicTitle => { score, total }

    quizzes.forEach(quiz => {
      const perTopicScore = quiz.score / quiz.topicsCovered.length;
      const perTopicTotal = quiz.totalQuestions / quiz.topicsCovered.length;

      quiz.topicsCovered.forEach(topicTitle => {
        if (!highestScores[topicTitle] || perTopicScore > highestScores[topicTitle].score) {
          highestScores[topicTitle] = {
            score: perTopicScore,
            total: perTopicTotal
          };
        }
      });
    });

    // Calculate progress across all topics (untouched ones contribute 0%)
    let totalProgress = 0;
    topicTitles.forEach(title => {
      const t = highestScores[title];
      if (t && t.total > 0) {
        totalProgress += (t.score / t.total) * 100;
      }
      // if no score, contributes 0%
    });

    const progressPercent = parseFloat((totalProgress / topicTitles.length).toFixed(2));

    res.status(200).json({
      subject,
      source,
      totalTopics: topicTitles.length,
      attemptedTopics: Object.keys(highestScores).length,
      progressPercent
    });

    console.log("🧪 All topic titles:", topicTitles);
    console.log("🧪 Quizzes fetched:", quizzes.map(q => ({
      score: q.score,
      total: q.totalQuestions,
      topics: q.topicsCovered
    })));
    console.log("🧪 Highest topic scores:", highestScores);

  } catch (err) {
    console.error("❌ Error calculating quiz progress:", err);
    res.status(500).json({ message: "Progress fetch failed", error: err.message });
  }
};
