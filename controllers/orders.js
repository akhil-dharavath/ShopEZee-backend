const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// @desc - Retrieve a list of user orders.
// @route - GET /orders
// @access - private - user access
const getAllOrders = asyncHandler(async (req, res) => {
  // get all orders and details
  const orders = await Order.find({ user: req.user.id });
  res.json(orders);
});

// @desc - Retrieve details for a specific order.
// @route - GET /orders/:orderId
// @access - private - user access
const getOneOrder = asyncHandler(async (req, res) => {
  // check order exists
  if (!req.params.orderId) {
    res.status(404);
    throw new Error("Order not found");
  }
  // get particular order details
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  // check is the person accessing his/her  order
  if (req.user.role==='user' && order.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Unauthorized to get the order details");
  }
  res.json(order);
});

// @desc - place order.
// @route - POST /orders
// @access - private - user access
const placeOrder = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  if (!req.headers.product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // get product details
  const productId = req.headers.product;
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  const qty = quantity ? quantity : 1;
  const user = req.user;
  // place order
  const order = await Order.create({
    user: user._id,
    product: product._id,
    quantity: qty,
    price:product.price,
    totalAmount: product.price * qty,
    name:product.name,
    image:product.image,
    description:product.description,
    status: "Pending",
  });
  if (!order) {
    res.status(500);
    throw new Error("Internal server error");
  }
  res.json(order);
});

// @desc - Cancel a specific order.
// @route - DELETE /orders/:orderId
// @access - private - user access
const deleteOneOrder = asyncHandler(async (req, res) => {
  // get user deatils
  const user = req.user;
  const orderId = req.params.orderId;
  if (!orderId) {
    res.status(404);
    throw new Error("Order not found");
  }
  // get order deatils
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  // check is the order placed by the logged in user 
  if (order.user.toString() !== user.id) {
    res.status(401);
    throw new Error("You have no access to cancel this order");
  }
  // delete the order
  const deleteOrder = await Order.findByIdAndDelete(
    { _id: orderId },
    { new: true }
  );
  if (deleteOrder) {
    res.status(200).json(deleteOrder);
  } else {
    res.status(500);
    throw new Error("Internal server Error");
  }
});

module.exports = {
  getAllOrders,
  getOneOrder,
  placeOrder,
  deleteOneOrder,
};
