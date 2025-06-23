const app = require("./app");
const connectDB = require("./config/db");

// Connect DB and start server
connectDB().then(() => {
  app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
  });
});
