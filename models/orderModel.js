const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, default: "Pending" }, // "Shipped," "Delivered," etc.
    name: { type: String },
    image: { type: String },
    price: { type: Number },
    description: { type: String },
  },
  {
    versionKey: false, // Disable the "__v" field
  }
);

module.exports = mongoose.model("Order", orderSchema);
