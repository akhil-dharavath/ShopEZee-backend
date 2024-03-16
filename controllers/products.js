const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

// @desc - Retrieve a list of all available products.
// @route - GET /products
// @access - public
const getAllProducts = asyncHandler(async (req, res) => {
  // get all products
  const products = await Product.find({});
  res.status(200).json(products);
});

// @desc - Retrieve details for a specific product.
// @route - GET /products/:productId
// @access - public
const getOneProduct = asyncHandler(async (req, res) => {
  // get particular product
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error("Product Not found");
  }
  res.status(200).json(product);
});

// @desc -  Create a new product.
// @route - POST /products
// @access - private - admin access
const createProduct = asyncHandler(async (req, res) => {
  // check is logged in person is admin
  if (!req.user || req.user.role !== "admin") {
    res.status(401);
    throw new Error("You are unauthorized");
  }
  // check whether all the required fields are entered
  const { name, description, price, category, stock, image, subCategory } = req.body;
  if (!name || !description || !price || !category || !stock || !image) {
    res.status(400);
    throw new Error("Please enter required fields");
  }
  // check if the product already exists
  const checkProduct = await Product.findOne({ name });
  if (checkProduct) {
    res.status(400);
    throw new Error("Product with this name is available");
  }
  // create product
  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    image,
    subCategory
  });
  res.status(201).json(product);
});

// @desc -  Update product details.
// @route - PUT /products/:productId
// @access - private - admin access
const updateOneProduct = asyncHandler(async (req, res) => {
  // check whether the logged in person is admin
  if (!req.user || req.user.role !== "admin") {
    res.status(401);
    throw new Error("You are unauthorized");
  }
  // check whether all the required fields are entered
  const { name, description, price, category, stock, image } = req.body;
  if (!name || !description || !price || !category || !stock || !image) {
    res.status(400);
    throw new Error("Please enter required fields");
  }
  // update the product details
  const product = await Product.findByIdAndUpdate(
    req.params.productId,
    {
      name,
      description,
      price,
      category,
      stock,
      image,
    },
    { new: true }
  );
  if (!product) {
    res.status(404);
    throw new Error("Product Not found");
  }
  res.status(200).json(product);
});

// @desc -  Delete a specific product.
// @route - DELETE products/:productId
// @access - private - admin access
const deleteOneProduct = asyncHandler(async (req, res) => {
  // check whether the logged in person is admin
  if (!req.user || req.user.role !== "admin") {
    res.status(401);
    throw new Error("You are unauthorized");
  }
  // find the product and delete
  const product = await Product.findByIdAndDelete(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error("Product Not found");
  }
  res.status(200).json(product);
});

module.exports = {
  getAllProducts,
  getOneProduct,
  createProduct,
  updateOneProduct,
  deleteOneProduct,
};
