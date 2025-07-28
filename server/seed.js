const mongoose = require('mongoose');
const fs = require('fs');
const TheoryTopic = require('./models/TheoryTopic');

const MONGO_URI = "mongodb+srv://ramlal0801:trackpass123@track2crack.5habq7c.mongodb.net/track2crack?retryWrites=true&w=majority&appName=Track2Crack"

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB connected");
  seedData();
}).catch(err => {
  console.error("❌ Connection error:", err);
});

async function seedData() {
  try {
    const data = JSON.parse(fs.readFileSync('./theory_topics_full.json', 'utf-8'));
    await TheoryTopic.insertMany(data);
    console.log(`✅ Inserted ${data.length} theory topics.`);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    mongoose.disconnect();
  }
}
