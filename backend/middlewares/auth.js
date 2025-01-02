const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decodedToken);

    const user = await User.findOne({ email: decodedToken.email });
    user.password = undefined;
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while verifying user",
      error,
    });
  }
};

module.exports = auth;
