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
const express = require('express');
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

module.exports = router;