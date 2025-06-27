const express = require('express');
const router = express.Router();
const { getCoreTopicsBySubject, updateCoreProgress, getUserCoreProgress } = require('../controllers/coreController');
const verifyToken = require('../middleware/verifyToken');
// GET /api/core/topics?subject=OS
router.get('/topics', getCoreTopicsBySubject);
// ✅ Save user progress (auth required)
router.post('/progress', verifyToken , updateCoreProgress);  

// ✅ Get user progress (auth required)
router.get('/progress/:userId', verifyToken, getUserCoreProgress); 

module.exports = router;
