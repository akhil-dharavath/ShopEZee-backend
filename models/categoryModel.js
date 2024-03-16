const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: [{ type: String }],
  },
  {
    versionKey: false, // Disable the "__v" field
  }
);

module.exports = mongoose.model("Category", categorySchema);
