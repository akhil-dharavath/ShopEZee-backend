const express = require("express");
const router = express.Router();
const {
  categories,
  category,
  search,
} = require("../controllers/categoryAndSearch");

router.get("/categories", categories);
router.get("/products", category);
router.get("/products/search", search);

module.exports = router;
