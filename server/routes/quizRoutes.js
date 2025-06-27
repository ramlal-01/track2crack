const express = require('express');
const router = express.Router();
const { generateQuiz, submitQuiz } = require('../controllers/quizController');
const verifyToken = require('../middleware/verifyToken');

// POST /api/quiz/generate
router.post('/generate',verifyToken, generateQuiz);
router.post('/submit', verifyToken, submitQuiz); 

module.exports = router;
