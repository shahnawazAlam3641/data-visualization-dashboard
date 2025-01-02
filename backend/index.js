const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./middlewares/auth");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "your server is up and running",
  });
});

app.post("/user/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if ((!name, !email, !password)) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandetory",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this Email already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    user.password = undefined;

    const token = jwt.sign(
      { name: user.name, email: user.email },
      process.env.JWT_SECRET
    );

    res.cookie("token", token);

    return res.status(200).json({
      success: true,
      message: "User Registered Successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while signing up",
      error,
    });
  }
});

app.post("/user/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if ((!email, !password)) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandetory",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const isPasswordCorrect = bcrypt.compare(password, user.password);
    console.log(isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      { name: user.name, email: user.email },
      process.env.JWT_SECRET
    );

    user.password = undefined;

    res.cookie("token", token);

    return res.status(200).json({
      success: true,
      message: "User Registered Successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while signing in",
      error,
    });
  }
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is running on PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
