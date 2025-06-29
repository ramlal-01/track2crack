const express = require('express');
const router = express.Router();
const { generateQuiz, submitQuiz ,getQuizHistory} = require('../controllers/quizController');
const verifyToken = require('../middleware/verifyToken');

// POST /api/quiz/generate
router.post('/generate',verifyToken, generateQuiz);
router.post('/submit', verifyToken, submitQuiz); 
router.get('/history', verifyToken, getQuizHistory);

module.exports = router;
