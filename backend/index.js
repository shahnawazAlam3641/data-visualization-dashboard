const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "your server is up and running",
  });
});

app.get("/user/signup", async (req, res) => {});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is running on PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
