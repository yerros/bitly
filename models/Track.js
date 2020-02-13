const mongoose = require("mongoose");
const TrackSchema = new mongoose.Schema({
  short_url_id: {
    type: mongoose.Types.ObjectId
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

module.exports = mongoose.model("Track", TrackSchema);
