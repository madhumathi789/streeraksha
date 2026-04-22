const mongoose = require("mongoose");

const guardianSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  relationship: {
    type: String,
    default: "Friend",
  },
}, { timestamps: true });

module.exports = mongoose.model("Guardian", guardianSchema);