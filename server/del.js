// cleanupInvalidReminders.js
const mongoose = require('mongoose');
require('dotenv').config(); // if using .env for DB_URI

// Replace this with your MongoDB Atlas URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ramlal0801:trackpass123@track2crack.5habq7c.mongodb.net/track2crack?retryWrites=true&w=majority&appName=Track2Crack';

const UserDSAProgress = require('./models/UserDSAProgress');
const UserCoreProgress = require('./models/UserCoreProgress');
const UserTheoryProgress = require('./models/UserTheoryProgress');

async function cleanup() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    const deletedDSA = await UserDSAProgress.deleteMany({
      remindOn: { $ne: null },
      $or: [{ questionId: null }, { questionId: { $exists: false } }]
    });

    const deletedCore = await UserCoreProgress.deleteMany({
      remindOn: { $ne: null },
      $or: [{ coreTopicId: null }, { coreTopicId: { $exists: false } }]
    });

    const deletedTheory = await UserTheoryProgress.deleteMany({
      remindOn: { $ne: null },
      $or: [{ topicId: null }, { topicId: { $exists: false } }]
    });

    console.log(`🧹 Deleted DSA junk: ${deletedDSA.deletedCount}`);
    console.log(`🧹 Deleted Core junk: ${deletedCore.deletedCount}`);
    console.log(`🧹 Deleted Theory junk: ${deletedTheory.deletedCount}`);

    await mongoose.disconnect();
    console.log("✅ Disconnected");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

cleanup();