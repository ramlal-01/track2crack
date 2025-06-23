const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
  },
  passwordHash: {
    type: String,
    required: true,
    minlength: 60 // bcrypt hashes are typically 60 chars
  },
  joined_on: {
    type: Date,
    default: Date.now
  },

  // 🔐 New Field: Role Support (for admin functionality in future)
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  settings: {
    contest_frequency_days: {
      type: Number,
      default: 7
    },
    include_bookmarks: {
      type: Boolean,
      default: true
    },
    include_retention_questions: {
      type: Boolean,
      default: true
    },
    preferred_language: {
      type: String,
      enum: ["cpp", "java", "python"],
      default: "cpp"
    }
  },

  platform_usernames: {
    leetcode: { type: String },
    codeforces: { type: String },
    gfg: { type: String },
    hackerrank: { type: String }
  },

  platforms: {
    leetcode: {
      synced: { type: Boolean, default: false },
      last_sync: { type: Date }
    },
    codeforces: {
      synced: { type: Boolean, default: false },
      last_sync: { type: Date }
    },
    gfg: {
      synced: { type: Boolean, default: false },
      last_sync: { type: Date }
    },
    hackerrank: {
      synced: { type: Boolean, default: false },
      last_sync: { type: Date }
    }
  }
});

module.exports = mongoose.model("User", userSchema);
