const express = require("express");
const router = express.Router();
// model
const Track = require("../models/Track");

router.get("/", async (req, res) => {
  const tracking = await Track.find().sort({ created_at: 1 });
  res.send(tracking);
});

module.exports = router;
