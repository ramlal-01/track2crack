const express = require('express');
const router = express.Router();
const { getCoreTopicsBySubject, updateCoreProgress, getUserCoreProgress } = require('../controllers/coreController');

// GET /api/core/topics?subject=OS
router.get('/topics', getCoreTopicsBySubject);
router.post('/progress', updateCoreProgress);  
router.get('/progress/:userId', getUserCoreProgress);

module.exports = router;
