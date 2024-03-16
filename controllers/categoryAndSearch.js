const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");

// @desc - Retrieve a list of product categories.
// @route - GET /categories
// @access - public
const categories = asyncHandler(async (req, res) => {
  // get categories and return them
  const categories = await Category.find({}).select("-_id");
  res.json(categories);
});

// @desc - Filter products by category.
// @route - GET /products?category=xyz
// @access - public
const category = asyncHandler(async (req, res) => {
  const { category } = req.query;
  // filter the products by category and return them
  const products = await Product.find({ category });
  res.json(products);
});

// @desc - Search for products by keyword.
// @route - GET /products?search=keyword
// @access - public
const search = asyncHandler(async (req, res) => { // incomplete
  // const { search } = req.query;
  // const products = await Product.find()
  res.json("/filters/products?search=keyword");
});

module.exports = { categories, category, search };
