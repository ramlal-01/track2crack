//feedbackController - Handles user feedback submission and storage.
const Feedback = require('../models/Feedback');
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    console.log("Feedback body:", rating, feedback);
    console.log("User from token:", req.user);

    const userId = req.user.userId;

    const newFeedback = new Feedback({ rating, feedback, userId });
    await newFeedback.save();

    res.status(201).json({ success: true, message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('Error saving feedback:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
