const Quiz = require('../models/Quiz');
// const { fetchMCQsFromGFG } = require('../utils/gfgScraper'); // ❌ NOT needed for now
const UserTheoryProgress = require('../models/UserTheoryProgress');
const UserCoreProgress = require('../models/UserCoreProgress');
const TheoryTopic = require('../models/TheoryTopic');
const CoreTopic = require('../models/CoreTopic'); 
// ✅ HARDCODED DEMO MCQs
const dummyMCQs = {
  Java: [
    {
      questionText: "What is the size of int in Java?",
      options: ["2 bytes", "4 bytes", "8 bytes", "Depends on OS"],
      correctAnswerIndex: 1
    },
    {
      questionText: "Which of the following is not a Java feature?",
      options: ["Object-oriented", "Use of pointers", "Portable", "Dynamic"],
      correctAnswerIndex: 1
    }
  ],
  OOPS: [
    {
      questionText: "Which principle binds data and functions together?",
      options: ["Encapsulation", "Abstraction", "Inheritance", "Polymorphism"],
      correctAnswerIndex: 0
    },
    {
      questionText: "Which OOP concept allows method overriding?",
      options: ["Encapsulation", "Polymorphism", "Abstraction", "Inheritance"],
      correctAnswerIndex: 1
    }
  ],
  DSA: [
    {
      questionText: "What is the time complexity of binary search?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correctAnswerIndex: 1
    },
    {
      questionText: "Which data structure uses FIFO?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      correctAnswerIndex: 1
    }
  ],
  OS: [
    {
      questionText: "What is a deadlock?",
      options: ["A program error", "A system crash", "Processes waiting indefinitely", "None"],
      correctAnswerIndex: 2
    }
  ],
  DBMS: [
    {
      questionText: "Which normal form eliminates transitive dependency?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      correctAnswerIndex: 2
    }
  ],
  CN: [
    {
      questionText: "What does IP stand for?",
      options: ["Internet Provider", "Internet Protocol", "Internal Protocol", "Internet Protection"],
      correctAnswerIndex: 1
    }
  ]
};

// ✅ FINAL generateQuiz CONTROLLER
exports.generateQuiz = async (req, res) => {
  try {
    const { subject, source } = req.body;
    const userId = req.user.userId;

    let topicDocs = [];

    if (source === 'Theory') {
      const progress = await UserTheoryProgress.find({ userId, isCompleted: true }).populate('topicId');
      topicDocs = progress.filter(p => p.topicId.subject === subject).map(p => p.topicId);
    } else if (source === 'Core') {
      const progress = await UserCoreProgress.find({ userId, isCompleted: true }).populate('coreTopicId');
      topicDocs = progress.filter(p => p.coreTopicId.subject === subject).map(p => p.coreTopicId);
    }

    // ✅ fallback to hardcoded dummy MCQs
    const allMCQs = dummyMCQs[subject] || [];

    if (allMCQs.length === 0) {
      return res.status(404).json({ message: "No MCQs available for this subject." });
    }

    const final = allMCQs.slice(0, 10);

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
