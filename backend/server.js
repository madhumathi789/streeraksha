const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded audio
app.use("/uploads/audio", express.static(path.join(__dirname, "uploads/audio")));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/guardian", require("./routes/guardian"));
app.use("/api/journal", require("./routes/journal"));
app.use("/api/tracks", require("./routes/track"));
app.use("/api/playlists", require("./routes/playlist"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));