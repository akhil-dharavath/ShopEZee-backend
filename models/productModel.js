const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
  },
  {
    versionKey: false, // Disable the "__v" field
  }
);

module.exports = mongoose.model("Product", productSchema);
