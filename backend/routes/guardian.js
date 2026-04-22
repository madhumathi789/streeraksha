/*const express = require('express');
const router = express.Router();
const Guardian = require('../models/Guardian');
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

// temporary memory before otp verify
let pendingGuardians = {};

// SEND OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { name, phone, relationship } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        message: 'Name and phone are required',
      });
    }

    pendingGuardians[phone] = {
      name,
      phone,
      relationship,
    };

    await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({
        to: phone,
        channel: 'sms',
      });

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// VERIFY OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const result = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: phone,
        code: otp,
      });

    if (result.status !== 'approved') {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const guardianData = pendingGuardians[phone];

    if (!guardianData) {
      return res.status(400).json({
        message: 'No guardian data found',
      });
    }

    const newGuardian = new Guardian({
      ...guardianData,
      verified: true,
    });

    await newGuardian.save();
    delete pendingGuardians[phone];

    res.json({ message: 'Guardian verified and saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'OTP verification failed' });
  }
});

// GET ALL GUARDIANS
router.get('/', async (req, res) => {
  try {
    const guardians = await Guardian.find().sort({ createdAt: -1 });
    res.json(guardians);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE GUARDIAN
router.delete('/:id', async (req, res) => {
  try {
    await Guardian.findByIdAndDelete(req.params.id);
    res.json({ message: 'Guardian deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

// SOS ALERT
router.post('/sos', async (req, res) => {
  try {
    const { location } = req.body;

    const guardians = await Guardian.find({ verified: true });

    if (!guardians.length) {
      return res.status(400).json({
        message: 'No verified guardians found',
      });
    }

    for (const guardian of guardians) {
      await client.messages.create({
        body: `🚨 STREERAKSHA SOS ALERT\n\nEmergency detected.\nLocation: ${location || 'Unavailable'}\nPlease help immediately.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: guardian.phone,
      });
    }

    res.json({
      message: 'SOS alert sent successfully',
      count: guardians.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send SOS alert' });
  }
});

module.exports = router;*/
/*const express = require('express');
const router = express.Router();
const Guardian = require('../models/Guardian');
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ✅ ADD GUARDIAN (NO OTP)
router.post('/', async (req, res) => {
  try {
    const { name, phone, relationship } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        message: 'Name and phone are required',
      });
    }

    const guardian = new Guardian({
      name,
      phone,
      relationship,
      verified: true,
    });

    await guardian.save();

    res.json({
      message: 'Guardian saved successfully',
      guardian,
    });
  } catch (error) {
    console.error('SAVE GUARDIAN ERROR:', error);
    res.status(500).json({
      message: 'Failed to save guardian',
      error: error.message,
    });
  }
});

// ✅ GET ALL GUARDIANS
router.get('/', async (req, res) => {
  try {
    const guardians = await Guardian.find().sort({ createdAt: -1 });
    res.json(guardians);
  } catch (error) {
    console.error('GET GUARDIANS ERROR:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// ✅ DELETE GUARDIAN
router.delete('/:id', async (req, res) => {
  try {
    await Guardian.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Guardian deleted successfully',
    });
  } catch (error) {
    console.error('DELETE GUARDIAN ERROR:', error);
    res.status(500).json({
      message: 'Delete failed',
      error: error.message,
    });
  }
});

// ✅ SOS ALERT WITH TWILIO SMS
router.post('/sos', async (req, res) => {
  try {
    const { location } = req.body;

    const guardians = await Guardian.find({ verified: true });

    if (!guardians.length) {
      return res.status(400).json({
        message: 'No guardians found',
      });
    }

    for (const guardian of guardians) {
      await client.messages.create({
        body: `🚨 STREERAKSHA SOS ALERT

Emergency detected.
Location: ${location || 'Unavailable'}
Please help immediately.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: guardian.phone,
      });
    }

    res.json({
      message: 'SOS alert sent successfully',
      count: guardians.length,
    });
  } catch (error) {
    console.error('TWILIO FULL ERROR:', error);
    console.error('TWILIO MESSAGE:', error.message);
    console.error('TWILIO CODE:', error.code);
    console.error('TWILIO MORE INFO:', error.moreInfo);

    res.status(500).json({
      message: error.message,
      code: error.code,
      moreInfo: error.moreInfo,
    });
  }
});

module.exports = router;*/
/*const express = require("express");
const router = express.Router();
const Guardian = require("../models/Guardian");
const admin = require("../firebase");


// ✅ Add guardian
router.post("/", async (req, res) => {
  try {
    const { name, phone, relationship } = req.body;

    const guardian = new Guardian({
      name,
      phone,
      relationship,
      verified: true,
    });

    await guardian.save();

    res.json({ message: "Guardian saved", guardian });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ Get all guardians
router.get("/", async (req, res) => {
  try {
    const guardians = await Guardian.find().sort({ createdAt: -1 });
    res.json(guardians);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ Delete guardian
router.delete("/:id", async (req, res) => {
  try {
    await Guardian.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 📲 Save FCM token
router.post("/save-token", async (req, res) => {
  try {
    const { token } = req.body;

    // TEST MODE: assign to all guardians
    await Guardian.updateMany({}, { fcmToken: token });

    res.json({ message: "Token saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🚨 SOS ALERT (FIREBASE PUSH)
router.post("/sos", async (req, res) => {
  try {
    const { location } = req.body;

    const guardians = await Guardian.find({ verified: true });

    const messages = guardians
      .filter((g) => g.fcmToken)
      .map((g) => ({
        token: g.fcmToken,
        notification: {
          title: "🚨 STREERAKSHA SOS ALERT",
          body: `Emergency detected!\nLocation: ${location || "Unavailable"}`,
        },
        data: {
          location: location || "",
        },
      }));

    if (!messages.length) {
      return res.status(400).json({ message: "No FCM tokens found" });
    }

    const response = await admin.messaging().sendEach(messages);

    res.json({
      message: "SOS sent via Firebase",
      success: response.successCount,
      failure: response.failureCount,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;*/
const express = require("express");
const router = express.Router();
const Guardian = require("../models/Guardian");
const twilio = require("twilio");

// ✅ Twilio setup
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ✅ ADD GUARDIAN
router.post("/", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { userId, name, phone, relationship } = req.body;

    if (!userId || !name || !phone) {
      return res.status(400).json({
        message: "userId, name, phone required",
      });
    }

    const guardian = new Guardian({
      userId,
      name,
      phone,
      relationship,
    });

    await guardian.save();

    res.json({ success: true, guardian });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save guardian" });
  }
});


// ✅ GET GUARDIANS BY USER
router.get("/:userId", async (req, res) => {
  try {
    const guardians = await Guardian.find({
      userId: req.params.userId,
    });

    res.json(guardians);

  } catch (err) {
    res.status(500).json({ message: "Error fetching guardians" });
  }
});


// ✅ DELETE GUARDIAN
router.delete("/:id", async (req, res) => {
  try {
    await Guardian.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});


// 🚨 SOS ALERT (TWILIO SMS)
router.post("/sos", async (req, res) => {
  try {
    const { userId, lat, lng } = req.body;

    const guardians = await Guardian.find({ userId });

    if (!guardians.length) {
      return res.status(404).json({
        message: "No guardians found",
      });
    }

    const locationLink = `https://www.google.com/maps?q=${lat},${lng}`;

    let successCount = 0;

    for (const g of guardians) {
      try {
        await client.messages.create({
          body: `🚨 STREERAKSHA SOS ALERT

User needs help!
Location: ${locationLink}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: g.phone, // must be +91XXXXXXXXXX
        });

        console.log("✅ SMS sent to:", g.phone);
        successCount++;

      } catch (err) {
        console.error("❌ SMS failed:", g.phone, err.message);
      }
    }

    res.json({
      success: true,
      guardiansNotified: successCount,
      communityNotified: 0, // for your frontend
    });

  } catch (err) {
    console.error("❌ SOS ERROR:", err);
    res.status(500).json({
      message: "Failed to send SOS",
    });
  }
});

module.exports = router;