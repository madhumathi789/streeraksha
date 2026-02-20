const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  mood: String,
  title: String,
  content: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Journal", journalSchema);