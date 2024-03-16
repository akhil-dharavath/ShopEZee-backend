const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactUsModel");
const express = require("express");
const router = express.Router();

const contactUs = asyncHandler(async (req, res) => {
  // check whether all required fields are entered
  const { name, subject, email, message } = req.body;
  if (!name || !message) {
    res.status(400);
    throw new Error("Please enter required fields");
  }
  // add data to database
  const contact = await Contact.create({ name, subject, email, message });
  if (!contact) {
    res.status(500);
    throw new Error("internal server error");
  }
  res.status(201).json(contact);
});

router.post("/", contactUs);

module.exports = router;
