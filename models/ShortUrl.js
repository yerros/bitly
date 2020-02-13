const mongoose = require("mongoose");

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
    type: mongoose.Types.ObjectId
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  track: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Track"
    }
  ]
});

module.exports = mongoose.model("ShortUrl", ShortUrlSchema);
