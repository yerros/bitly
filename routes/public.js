const express = require("express");
const shortid = require("shortid");
require("dotenv").config();
const baseUrl = process.env.baseURI;
const router = express.Router();
// model
const ShortUrl = require("../models/ShortUrl");
const Track = require("../models/Track");

// @route        GET /
// @desc         Index
// @access       public
router.get("/", (req, res) => {
  res.json({ msg: "Public Routes" });
});

// @route        GET /shorten
// @desc         Create new short url
// @access       public
router.post("/shorten", async (req, res) => {
  const shortUrl = shortid.generate();
  const oriUrl = req.body.url;
  const length = await ShortUrl.countDocuments();
  let savetoDB = new ShortUrl({
    short_url: shortUrl,
    url: oriUrl
  });
  await savetoDB.save();
  res.json({
    short_url: baseUrl + shortUrl,
    url: oriUrl
  });
});

// @route        GET /go/:id
// @desc         Redirect to Original Url
// @access       public
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let redirectLink = await ShortUrl.findOne({ short_url: id });
    if (!redirectLink) {
      return res.status(500).send("Server Error 1");
    }

    const short_url_id = redirectLink._id;
    const referrer_url = req.headers.referer || "";
    const ip_address = req.connection.remoteAddress || "";

    let tracking = new Track({
      short_url_id,
      ip_address,
      referrer_url
    });

    await tracking.save();
    await ShortUrl.findByIdAndUpdate(
      { _id: short_url_id },
      { $push: { track: tracking._id } }
    );
    res.redirect(redirectLink.url);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error 1");
  }
});

module.exports = router;
