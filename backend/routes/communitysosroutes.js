const express = require("express");
const router = express.Router();
const admin = require("../firebase"); // your firebase-admin config

// If you're using firebase-admin, use admin.firestore()
const db = admin.firestore();

const RADAR = 0.015;

// POST /api/community-sos
router.post("/", async (req, res) => {
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Location required" });
  }

  try {
    const alertRef = await db.collection("sosAlerts").add({
      userId: "unknown",
      location: { lat, lng },
      time: new Date(),
      status: "active",
    });

    const alertId = alertRef.id;

    const snapshot = await db.collection("users").get();

    const nearbyUsers = snapshot.docs.map(doc => doc.data());

    const messages = nearbyUsers
      .filter(u => u.fcmToken)
      .map(u => ({
        token: u.fcmToken,
        notification: {
          title: "🚨 Community SOS Alert",
          body: "Someone nearby needs help",
        },
      }));

    let successCount = 0;

    if (messages.length > 0) {
      const response = await admin.messaging().sendEach(messages);
      successCount = response.successCount;
    }

    res.json({
      success: true,
      alertId,
      fcmSent: successCount,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;