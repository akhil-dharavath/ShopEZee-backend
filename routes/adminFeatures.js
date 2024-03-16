const express = require("express");
const router = express.Router();
const validateUser = require('../middlewares/validateUser');
const {
  createProduct,
  createCategory,
  orders,
  updateOrder,
} = require("../controllers/admin");

router.use(validateUser)
router.post("/create-product", createProduct);
router.post("/create-category", createCategory);
router.get("/orders", orders);
router.put("/update-order/:orderId", updateOrder);

module.exports = router;
