const express = require('express');
const router = express.Router();
const { getAllDSAQuestions, updateDSAProgress, getUserDSAProgress } = require('../controllers/dsaController');


// ✅ Import middleware
const verifyToken = require('../middleware/verifyToken');

router.get('/questions', getAllDSAQuestions);
 
router.post('/progress', updateDSAProgress); 

router.get('/progress/:userId', verifyToken, getUserDSAProgress);
module.exports = router;
