const express = require("express");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");
const moment = require("moment");
const User = require("../models/User");
const ShortUrl = require("../models/ShortUrl");
require("dotenv").config();
const baseUrl = process.env.baseURI;
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const today = moment().startOf("day");
const yesterday = moment(today).endOf("day");

// @route        GET /user
// @desc         User Dashboard
// @access       private

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id })
      .select("-password")
      .populate({ path: "shorturls", options: { sort: { created_at: -1 } } });
    res.json({
      user
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error 1");
  }
});

// @route        GET /user/track
// @desc         User tracking
// @access       private

router.get("/track", authMiddleware, async (req, res) => {
  try {
    if (req.query.filter == "today") {
      const thisDay = await ShortUrl.find({
        created_at: { $gte: today, $lte: yesterday }
      });
      res.send(thisDay);
    }
    if (req.query.filter == "month") {
      return res.send("month");
    }
    if (req.query.filter == "year") {
      return res.send("year");
    }
    const links = await ShortUrl.find({ user_id: req.user.id }).populate({
      path: "track",
      options: { sort: { created_at: -1 } }
    });
    res.json({
      links
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error 1");
  }
});

// @route        Put /user/:id
// @desc         Edit Shorturl
// @access       private
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    await ShortUrl.findOneAndUpdate(
      { short_url: req.params.id },
      { $set: { short_url: req.body.name } }
    );
    res.status(200).json({ msg: "Update Success" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error 2");
  }
});

// @route        DELETE /user/:id
// @desc         Delete Shorturl
// @access       private
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await ShortUrl.findOneAndDelete({ short_url: req.params.id });
    res.status(200).json({ msg: "Delete Success" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error 3");
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
    res.status(500).send("Server Error 5");
  }
});

module.exports = router;
