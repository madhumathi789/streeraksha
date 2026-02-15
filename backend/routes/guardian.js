const express = require("express");
const router = express.Router();
const Guardian = require("../models/Guardian");
const crypto = require("crypto");

// Generate 6-digit OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

/* ---------------- SEND OTP ---------------- */
router.post("/send-otp", async (req, res) => {
  try {
    const { name, phone, email, relationship } = req.body;

    const otp = generateOTP();

    const guardian = new Guardian({
      name,
      phone,
      email,
      relationship,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000 // 5 min
    });

    await guardian.save();

    console.log("Guardian OTP:", otp); // 🔐 For testing

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- VERIFY OTP ---------------- */
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const guardian = await Guardian.findOne({ phone });

    if (!guardian) {
      return res.status(400).json({ message: "Guardian not found" });
    }

    if (guardian.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (guardian.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    guardian.isVerified = true;
    guardian.otp = null;
    await guardian.save();

    res.json({ message: "Guardian verified successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;