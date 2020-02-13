const express = require("express");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const authMiddleware = require("../middleware/auth");

require("dotenv").config();

router.get("/", authMiddleware, (req, res) => {
  res.send("user route");
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: "Something error found" });
    }

    user = new User({
      name,
      email,
      password
    });

    const salt = await bycrypt.genSalt(10);
    user.password = await bycrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };
    jwt.sign(payload, process.env.secretJWT, (err, token) => {
      if (err) throw err;
      res.json({
        msg: "User succefully signup",
        token
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Something error found" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Email Salah" });
    }

    let checkPassword = await bycrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).send({ msg: "Password Salah" });
    }

    const payload = {
      user: {
        id: user.id
      }
    };
    jwt.sign(payload, process.env.secretJWT, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
