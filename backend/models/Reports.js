const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
