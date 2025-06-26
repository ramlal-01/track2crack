const app = require("./app");
const connectDB = require("./config/db");
require("dotenv").config(); // ✅ Load .env variables

// Use PORT from environment or default to 3000
const PORT = process.env.PORT || 3000;

// Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
