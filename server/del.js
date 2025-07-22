// cleanupInvalidReminders.js
const mongoose = require('mongoose');
require('dotenv').config(); // if using .env for DB_URI

// Replace this with your MongoDB Atlas URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ramlal0801:trackpass123@track2crack.5habq7c.mongodb.net/track2crack?retryWrites=true&w=majority&appName=Track2Crack';

 

 
const CoreTopic = require('./models/CoreTopic');      // Adjust the path if different
const TheoryTopic = require('./models/TheoryTopic');  // Only if you're storing CN here

 

async function deleteCNTopics() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete from CoreTopic
    const coreResult = await CoreTopic.deleteMany({ subject: 'DSA' });
    console.log(`🗑️ Deleted ${coreResult.deletedCount} CN topics from CoreTopic`);

    // If CN was also inserted into TheoryTopic accidentally
    const theoryResult = await TheoryTopic.deleteMany({ subject: 'DSA' });
    console.log(`🗑️ Deleted ${theoryResult.deletedCount} CN topics from TheoryTopic`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error deleting CN topics:', error);
  }
}

deleteCNTopics();
