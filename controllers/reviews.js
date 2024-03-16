const asyncHandler = require("express-async-handler");
const Review = require("../models/reviewsModel");

// @desc - Add a review and rating for a product.
// @route - POST /products/:productId
// @access - private - user access
const postReview = asyncHandler(async (req, res) => {
  // get product id from url
  if (!req.params.productId) {
    res.status(404);
    throw new Error("Product not found");
  }
  const user = req.user;
  const { rating, review } = req.body;
  if (!rating) {
    res.status(400);
    throw new Error("Please enter required fields");
  }
  // check whether already reviewed
  const checkReviewed = await Review.findOne({
    user: user.id,
    productId: req.params.productId,
  });
  if (checkReviewed) {
    res.status(400);
    throw new Error(
      "Cannot review the same product more than once try updating old review"
    );
  }
  // post review
  const postReview = await Review.create({
    user: user.id,
    productId: req.params.productId,
    rating,
    review,
  });
  res.json(postReview);
});

// @desc - Retrieve product reviews and ratings.
// @route - GET /products/:productId/reviews
// @access - public
const getReviews = asyncHandler(async (req, res) => {
  // get particular product reviews
  const reviews = await Review.find({ productId: req.params.productId });
  if (!reviews) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(reviews);
});

module.exports = { postReview, getReviews };
