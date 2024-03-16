const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Contact = require("../models/contactUsModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc - Retrieve user profile information.
// @route - GET /users/:userId
// @access - private - user access
const getUserDetails = asyncHandler(async (req, res) => {
  // check whether the user is logged in
  if (!req.user.id) {
    res.status(401);
    throw new Error("You are not authorized");
  }
  // get user details
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// @desc - Update user profile information.
// @route - PUT /users/:userId
// @access - public
const updateUserDetails = asyncHandler(async (req, res) => {
  // check whether the user is logged in
  const user = req.user;
  if (!user.id) {
    res.status(401);
    throw new Error("You are unauthorized");
  }
  // get all the deatils entered for updating the profile
  const { username, email, oldpassword, password, contactNumber, gender, dob } =
    req.body;
  if (!oldpassword || !username || !email) {
    res.status(400);
    throw new Error("Please enter required fields");
  }
  // if passowrd is entered hash it
  let hashedPassword;
  const getUser = await User.findById(user.id);
  if (password && password !== "") {
    hashedPassword = await bcrypt.hash(password, 10);
  }
  //compare password
  const checkPassword = await bcrypt.compare(oldpassword, getUser.password);
  if (!checkPassword) {
    res.status(401);
    throw new Error("Enter the correct password");
  }
  const updatedPassword = password ? hashedPassword : getUser.password;
  // update user
  const updateUser = await User.findByIdAndUpdate(
    user.id,
    { username, password: updatedPassword },
    { new: true }
  ).select("-password");
  // create json web token and return it as response
  const token = jwt.sign(
    {
      user: {
        username: updateUser.username,
        email: getUser.email,
        role: updateUser.role,
        id: updateUser.id,
      },
    },
    process.env.JWT_SECRET_KEY
  );
  res.json({ token });
});

// @desc - Delete a user account.
// @route - DELETE /products/:productId/reviews
// @access - private - user and admin access
const deleteUser = asyncHandler(async (req, res) => {
  // check whether the user is logged in
  const user = req.user;
  // if (user.id !== req.params.userId || user.role !== "admin") {
  //   res.status(401);
  //   throw new Error("You are unauthorized");
  // }

  // delete user details
  const deletedUser = await User.findByIdAndDelete(user.id).select("-password");
  res.json(deletedUser);
});

module.exports = { getUserDetails, updateUserDetails, deleteUser };
