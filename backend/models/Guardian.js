const mongoose = require("mongoose");

const guardianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  relationship: String,
  otp: String,
  otpExpires: Date,
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Guardian", guardianSchema);