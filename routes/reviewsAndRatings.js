const express = require("express");
const router = express.Router();
const validateUser = require("../middlewares/validateUser");
const { postReview, getReviews } = require("../controllers/reviews");

router.post("/:productId/reviews", validateUser, postReview);
router.get("/:productId/reviews", getReviews);

module.exports = router;
