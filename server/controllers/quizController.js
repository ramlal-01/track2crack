// Imports
const Quiz = require('../models/Quiz');
const QuizQuestion = require('../models/QuizQuestion');

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

