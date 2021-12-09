const express = require("express");
const trying = require("./routes/trying");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 8001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/try", trying);
app.get("/", (req, res) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});
