const express = require('express');
const router = express.Router();
const { getReminderItems } = require('../controllers/revisionController');

// GET /api/revision/reminders/:userId
router.get('/reminders/:userId', getReminderItems);

module.exports = router;
