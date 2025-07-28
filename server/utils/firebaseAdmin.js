const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccountPath = process.env.NODE_ENV === "production"
  ? "/etc/secrets/firebaseServiceAccount.json"
  : path.join(__dirname, "../config/firebaseServiceAccount.json");

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
