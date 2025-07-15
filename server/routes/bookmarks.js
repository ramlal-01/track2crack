const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { updateLastAccessed  } = require('../controllers/updateLastAccessed');
const {   getRecentBookmarks } = require('../controllers/getRecentBookmarks');
router.patch('/access', verifyToken, updateLastAccessed);
router.get('/recent', verifyToken, getRecentBookmarks);
module.exports = router;
