const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  req.msg = "in private route";
  next();
});
router.get("/", (req, res) => {
  res.json({ msg: req.msg });
});

module.exports = router;
