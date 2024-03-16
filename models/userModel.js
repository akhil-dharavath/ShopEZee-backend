const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" }, // "admin" or "user"
    contactNumber: { type: String },
    gender: { type: String },
    dob: { type: String },
  },
  {
    versionKey: false, // Disable the "__v" field
  }
);

module.exports = mongoose.model("User", userSchema);
