const mongoose = require("mongoose");
const uuidv4 = require("uuid/v4");
const TrackSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4
  },
  short_url_id: {
    type: String
  },
  ip_address: {
    type: String
  },
  referrer_url: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("track", TrackSchema);
