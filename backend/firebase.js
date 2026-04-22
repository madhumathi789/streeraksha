const admin = require("firebase-admin");
const serviceAccount = require("./streeraksha-43166-firebase-adminsdk-fbsvc-ff47b3b693.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;