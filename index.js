const express = require("express");
const connectDB = require("./config/db");

const app = express();
app.use(express.json());
connectDB();
app.use("/", require("./routes/public"));
app.use("/user", require("./routes/user"));

const port = process.env.PORT || 5000;
app.listen(port, err => {
  if (err) throw err;
  console.log(`Server running at ${port}`);
});
