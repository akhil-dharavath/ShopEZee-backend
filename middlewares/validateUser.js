const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const validateUser = asyncHandler(async (req, res, next) => {
  // check whether authtoken is available in headers (logged in)
  const authToken = req.headers.authtoken;
  if (!authToken) {
    res.status(401);
    throw new Error("You are not authorized");
  }
  // decode the json auth token
  const decodedUser = jwt.decode(authToken, process.env.JWT_SECRET_KEY);
  if (!decodedUser || !decodedUser.user || !decodedUser.user.id) {
    res.status(401);
    throw new Error("You are not authorized");
  }
  // get user details excluding hashed password
  const user = await User.findById(decodedUser.user.id).select("-password");
  if (!user) {
    res.status(401);
    throw new Error("You are not authorized");
  }
  // return user details
  req.user = user;
  next();
});

module.exports = validateUser;
