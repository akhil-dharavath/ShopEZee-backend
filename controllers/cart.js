const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");

// @desc -  Add a product to the shopping cart.
// @route - POST cart/add-to-cart
// @access - private - user access
const addToCart = asyncHandler(async (req, res) => {
  // check whether the person is logged in
  const user = req.user;
  if (!req.headers.product) {
    res.status(400);
    throw new Error("Product not found");
  }
  const productId = req.headers.product;
  // check whether the product is already available in cart
  const isProductAvailableInCart = await Cart.find({ productId });
  const available = isProductAvailableInCart.filter(
    (data) => data.user.toString() === user._id.toString()
  );
  if (available.length > 0) {
    res.status(400);
    throw new Error("Product already added to cart");
  }
  // get product deatils if it is not in cart
  const { quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  const qty = quantity ? quantity : 1;
  // add the product to cart
  const cart = await Cart.create({
    user: user._id,
    productId,
    name: product.name,
    description: product.description,
    price: product.price * qty,
    quantity: qty,
    image: product.image,
  });
  if (!cart) {
    res.status(500);
    throw new Error("Internal server Error");
  }
  res.status(201).json(cart);
});

// @desc -  Get all products from shopping cart.
// @route - GET cart/get-cart
// @access - private - user access
const getCart = asyncHandler(async (req, res) => {
  // check whether the person is logged in
  const user = req.user;
  const getCartProducts = await Cart.find({ user: user.id });
  res.json(getCartProducts);
});

// @desc -  Remove a product from shopping cart.
// @route - DEELTE cart/remove-from-cart
// @access - private - user access
const removeFromCart = asyncHandler(async (req, res) => {
  // check whether the person is logged in
  const user = req.user;
  if (!req.headers.product) {
    res.status(404);
    throw new Error("Product not found");
  }
  const productId = req.headers.product;
  const removeItem = await Cart.findOne({ productId, user: user._id });
  if (!removeItem) {
    res.status(400);
    throw new Error("product not found");
  }
  const deleteItem = await Cart.findByIdAndDelete(removeItem._id);
  if (!deleteItem) {
    throw new Error("Internal server error");
  }
  res.status(200).json(deleteItem);
});

// @desc -  Update a product of shopping cart.
// @route - PUT cart/update-cart
// @access - private - user access
const updateCart = asyncHandler(async (req, res) => {
  // check whether the person is logged in
  const user = req.user;
  if (!req.headers.product) {
    res.status(404);
    throw new Error("Product not found");
  }
  const productId = req.headers.product;
  const updateItem = await Cart.findOne({ productId, user: user._id });
  const product = await Product.findById(productId);
  if (!updateItem || !product) {
    res.status(404);
    throw new Error("product not found");
  }
  const { quantity } = req.body;
  const qty = quantity ? quantity : 1;
  const updatedItem = await Cart.findByIdAndUpdate(
    updateItem._id,
    { quantity: qty, price: product.price * parseInt(qty) },
    {
      new: true,
    }
  );
  if (!updatedItem) {
    throw new Error("Internal server error");
  }
  res.status(200).json(updatedItem);
});

module.exports = { addToCart, getCart, removeFromCart, updateCart };
