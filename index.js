const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());
connectDB();
app.use("/", require("./routes/public"));
app.use("/user", require("./routes/user"));
app.use("/track", require("./routes/track"));

const port = process.env.PORT || 5000;
app.listen(port, err => {
  if (err) throw err;
  console.log(`Server running at ${port}`);
});
