// utils/firebaseAdmin.js
const admin = require("firebase-admin");

const serviceAccount = require("../config/firebaseServiceAccount.json"); // place this file in config/

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
