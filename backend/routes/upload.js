const express = require("express");
const multer = require("multer");
const Track = require("../models/Track");
const path = require("path");

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/audio"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Upload new track
router.post("/", upload.single("audio"), async (req, res) => {
  const { title, category, artist, duration } = req.body;
  if (!req.file) return res.status(400).json({ message: "Audio file required" });

  try {
    const track = new Track({
      title,
      category,
      artist,
      duration,
      audioUrl: `/uploads/audio/${req.file.filename}`
    });
    await track.save();
    res.status(201).json(track);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;