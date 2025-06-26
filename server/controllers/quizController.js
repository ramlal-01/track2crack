const Quiz = require('../models/Quiz');

// POST /api/quiz/generate
exports.generateQuiz = async (req, res) => {
  try {
    const { userId, subject, selectedTopics } = req.body;

    if (!userId || !subject || !selectedTopics || selectedTopics.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // For now: sample mock questions (can replace with DB later)
    const questions = [
      {
        questionText: "What is JVM?",
        options: ["Java Virtual Machine", "Java Verified Method", "Just Virtual Memory", "None"],
        correctAnswerIndex: 0
      },
      {
        questionText: "Which of these is not OOPS concept?",
        options: ["Encapsulation", "Polymorphism", "Compilation", "Inheritance"],
        correctAnswerIndex: 2
      }
    ];

    res.status(200).json({ subject, count: questions.length, questions });

  } catch (error) {
    res.status(500).json({ message: "Failed to generate quiz", error: error.message });
  }
};

// POST /api/quiz/submit
exports.submitQuiz = async (req, res) => {
  try {
    const { userId, subject, source, questions, bookmarkedQuestions } = req.body;

    if (!userId || !subject || !source || !questions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Calculate score
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