const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header("secret_token");

  if (!token) {
    return res.status(401).json({ msg: "Authorization denied!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.secretJWT);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
