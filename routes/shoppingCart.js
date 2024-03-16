const express = require("express");
const router = express.Router();
const validateUser = require("../middlewares/validateUser");
const {
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
} = require("../controllers/cart");

router.post("/add-to-cart", validateUser, addToCart);
router.get("/get-cart", validateUser, getCart);
router.delete("/remove-from-cart", validateUser, removeFromCart);
router.put("/update-cart", validateUser, updateCart);

module.exports = router;
