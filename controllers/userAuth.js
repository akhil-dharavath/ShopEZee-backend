const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc - Create a new user account.
// @route - POST /users/register
// @access - public
const register = asyncHandler(async (req, res) => {
  // check whether all required fields are entered
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please enter required fields");
  }
  // check user with this email already exists
  const checkUser = await User.findOne({ email });
  if (checkUser) {
    res.status(400);
    throw new Error(
      "User with this email already exists! Choose a unique email"
    );
  }
  const roleOfUser = role ? role : "user";
  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role: roleOfUser,
  })
  if (!user) {
    res.status(500);
    throw new Error("Internal server Error");
  }
  // create json web token with secret key
  const token = jwt.sign(
    { user: { username, email, role: roleOfUser, id: user._id } },
    process.env.JWT_SECRET_KEY
  );
  res.status(201).json({ token });
});

// @desc - Authenticate the user and issue an access token.
// @route - POST /users/login
// @access - public
const login = asyncHandler(async (req, res) => {
  // check whether all required fields are entered
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter required fields");
  }
  // check whether the entered email is registered 
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid login credentials");
  }
  // compare the enterd password and existing password 
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    res.status(401);
    throw new Error("Invalid login credentials");
  }
  // create json web token with secret key
  const token = jwt.sign(
    {
      user: { username: user.username, email, role: user.role, id: user._id },
    },
    process.env.JWT_SECRET_KEY
  );
  res.status(200).json({ token });
});

module.exports = { register, login };
