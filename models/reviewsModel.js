const mongoose = require("mongoose");

const reviewsSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    rating: { type: Number, required: true },
    review: { type: String },
  },
  {
    versionKey: false, // Disable the "__v" field
  }
);

module.exports = mongoose.model("Review", reviewsSchema);
