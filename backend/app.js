const express = require("express");
const cors = require("cors");

const guardianRoutes = require("./routes/guardian.routes");
const sosRoutes = require("./routes/sos.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/guardian", guardianRoutes);
app.use("/api/sos", sosRoutes);

module.exports = app;