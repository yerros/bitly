const express = require("express");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");
const User = require("../models/User");
const ShortUrl = require("../models/ShortUrl");
require("dotenv").config();
const baseUrl = process.env.baseURI + "/go/";
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// @route        GET /user
// @desc         User Dashboard
// @access       private

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id })
      .select("-password")
      .populate("shorturls");
    res.json({
      user
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route        GET /shorten
// @desc         Create new short url
// @access       private
router.post("/shorten", authMiddleware, async (req, res) => {
  const { url, title } = req.body;
  const shortUrl = title || shortid.generate();
  if (!url) {
    return res.status(400).json({ errors: "Something error found" });
  }

  let savetoDB = new ShortUrl({
    user_id: req.user.id,
    short_url: shortUrl,
    url
  });
  await savetoDB.save();
  await User.findByIdAndUpdate(
    { _id: req.user.id },
    { $push: { shorturls: savetoDB._id } }
  );
  res.json({
    short_url: baseUrl + shortUrl,
    url
  });
});

// @route        POST /user/register
// @desc         Register new user
// @access       public
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

// @route        POST /user/login
// @desc         User Login
// @access       public
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
