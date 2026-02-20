// models/Track.js
const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ["Calm", "Happy", "Focus", "Sleep", "Motivational"]
  },
  artist: { 
    type: String, 
    default: "Unknown Artist" 
  },
  duration: { 
    type: String, 
    default: "3:30" 
  },
  audioUrl: { 
    type: String, 
    required: true 
  },
  plays: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Track", trackSchema);