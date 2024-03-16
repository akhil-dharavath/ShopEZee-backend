const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOneOrder,
  placeOrder,
  deleteOneOrder,
} = require("../controllers/orders");
const validateUser = require("../middlewares/validateUser");

router
  .route("/")
  .get(validateUser, getAllOrders)
  .post(validateUser, placeOrder);
router
  .route("/:orderId")
  .get(validateUser, getOneOrder)
  .delete(validateUser, deleteOneOrder);

module.exports = router;
