const express = require("express");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("user route");
});

router.post("/register", (req, res) => {
  res.send(req.body);
});

router.post("/login", (req, res) => {
  res.send(req.body);
});

module.exports = router;
