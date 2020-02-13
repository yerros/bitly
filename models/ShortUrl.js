const mongoose = require("mongoose");
const shortid = require("shortid");
const ShortUrlSchema = new mongoose.Schema({
  title: {
    type: String
  },
  short_url: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  },
  user_id: {
    type: Number
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("shortUrl", ShortUrlSchema);
