const mongoose = require("mongoose");

const contactUsSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    subject: { type: String },
    email: { type: String },
    message: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Contact", contactUsSchema);
