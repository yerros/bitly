const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  shorturls: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShortUrl"
    }
  ]
});

module.exports = mongoose.model("User", UserSchema);
