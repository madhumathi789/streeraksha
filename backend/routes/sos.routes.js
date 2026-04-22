const express = require("express");
const router = express.Router();
const { triggerSOS } = require("../controllers/sos.controller");

router.post("/", triggerSOS);

module.exports = router;