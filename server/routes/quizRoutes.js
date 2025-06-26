const express = require('express');
const router = express.Router();
const { generateQuiz, submitQuiz } = require('../controllers/quizController');

// POST /api/quiz/generate
router.post('/generate', generateQuiz);
router.post('/submit', submitQuiz); 

module.exports = router;
