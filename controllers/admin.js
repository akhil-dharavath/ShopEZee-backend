const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");

// @desc - Create a new product.
// @route - POST /admin/create-product
// @access - private - admin access
const createProduct = asyncHandler(async (req, res) => {
  // check whether the logged in preson is admin
  if (!req.user || req.user.role !== "admin") {
    res.status(401);
    throw new Error("You are not authorized");
  }
  // check all the required fields are entered 
  const { name, description, price, category, stock, image } = req.body;
  if (!name || !description || !price || !category || !stock || !image) {
    res.status(400);
    throw new Error("Please enter all required fields");
  }
  // check whether the product already exists
  const isProductAvailable = await Product.findOne({ name });
  if (isProductAvailable) {
    res.status(400);
    throw new Error("Product with this name already available");
  }
  // add product
  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    image,
  });
  // return product
  res.json(product);
});

// @desc - Create a new product category (admin access).
// @route - POST /admin/create-category
// @access - private - admin access
const createCategory = asyncHandler(async (req, res) => {
  // check whether the logged in preson is admin
  if (!req.user || req.user.role !== "admin") {
    res.status(401);
    throw new Error("You are not authorized");
  }
  // check all the required fields are entered 
  const { name, description } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Please enter required fields");
  }
  // check whether the category already exists
  const checkCategory = await Category.findOne({ name });
  if (checkCategory) {
    const check = checkCategory.description.filter((cat)=>(cat===description));
    if(check.length!==0){
      res.status(500);
      throw new Error("Cannot add two similar categories");
    }
    const addCategory = [...checkCategory.description, description];
    // if category exists add the sub category to the list
    const update = await Category.findByIdAndUpdate(
      checkCategory.id,
      { description: addCategory },
      { new: true }
    );
    if (!update) {
      res.status(500);
      throw new Error("Internal server Error");
    }
    res.status(201).json(update);
    return;
  }
  // create category with subcategory if entered
  const category = await Category.create({ name, description });
  if (!category) {
    res.status(500);
    throw new Error("Internal server Error");
  }
  res.status(201).json(category);
});

// @desc - Retrieve a list of all orders.
// @route - GET /admin/orders
// @access - private - admin access
const orders = asyncHandler(async (req, res) => {
  // check whether the logged in preson is admin
  if (!req.user || req.user.role !== "admin") {
    res.status(401);
    throw new Error("You are not authorized");
  }
  // get all orders and return them
  const orders = await Order.find({});
  res.json(orders);
});

// @desc - Update order status.
// @route - POST /admin/update-order/:orderId
// @access - public - admin access
const updateOrder = asyncHandler(async (req, res) => {
  // check whether admin the logged in preson is admin
  if (!req.user || req.user.role !== "admin") {
    res.status(401);
    throw new Error("You are not authorized");
  }
  const orderId = req.params.orderId;
  if (!orderId) {
    res.status(404);
    throw new Error("Order not found");
  }
  // get the order deatails
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  const status = req.body.status;
  if (!status) {
    res.status(404);
    throw new Error("Status not found");
  }
  // update the order
  const updateOrder = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );
  if (updateOrder) {
    res.status(200).json(updateOrder);
  } else {
    res.status(500);
    throw new Error("Internal server Error");
  }
});

module.exports = { createProduct, createCategory, orders, updateOrder };
