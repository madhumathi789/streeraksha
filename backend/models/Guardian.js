const mongoose = require("mongoose");

const guardianSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: String,
    email: { type: String, required: true },
    relationship: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guardian", guardianSchema);