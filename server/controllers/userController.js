const DSAProgress = require('../models/UserDSAProgress');
const CoreProgress = require('../models/UserCoreProgress');
const TheoryProgress = require('../models/UserTheoryProgress');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.params.userId;

    const [dsa, core, theory, quiz] = await Promise.all([
      DSAProgress.findOne({ userId }),
      CoreProgress.findOne({ userId }),
      TheoryProgress.findOne({ userId }),
      Quiz.find({ userId }).sort({ takenAt: -1 }).limit(5)
    ]);

    return res.status(200).json({
      dsaProgress: dsa || {},
      coreProgress: core || {},
      theoryProgress: theory || {},
      quizHistory: quiz || []
    });
  } catch (err) {
    console.error('Dashboard Fetch Error:', err);
    res.status(500).json({ message: 'Server Error: Failed to fetch dashboard data' });
  }
};


exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Profile Fetch Error:', err);
    res.status(500).json({ message: 'Server Error: Failed to fetch profile' });
  }
};


exports.updateUserProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: req.body },
      { new: true }
    ).select('-password');
    res.json(updated);
  } catch (err) {
    console.error('Profile Update Error:', err);
    res.status(500).json({ message: 'Server Error: Failed to update profile' });
  }
};

 
const path = require('path');

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const filePath = `/uploads/${req.file.filename}`; // relative path

    const updated = await User.findByIdAndUpdate(
      req.params.userId,
      { avatarUrl: filePath },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Avatar uploaded successfully',
      avatarUrl: filePath,
      user: updated
    });
  } catch (err) {
    console.error('Avatar Upload Error:', err);
    res.status(500).json({ message: 'Server Error: Failed to upload avatar' });
  }
};


const bcrypt = require("bcrypt");

exports.changePassword = async (req, res) => {
  const userId = req.user.userId;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return res.status(400).json({ message: "Both passwords are required" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Old password incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};



exports.deleteAccount = async (req, res) => {
  const userId = req.user.userId;

  try { 
    await Promise.all([
      User.findByIdAndDelete(userId),
      DSAProgress.deleteOne({ userId }),
      CoreProgress.deleteOne({ userId }),
      TheoryProgress.deleteOne({ userId }),
      Quiz.deleteMany({ userId })
    ]);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Account deletion failed:", err);
    res.status(500).json({ message: "Server error while deleting account" });
  }
};

