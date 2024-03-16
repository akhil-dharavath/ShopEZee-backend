const express = require("express");
const router = express.Router();
const validateUser = require('../middlewares/validateUser');
const {
  getAllProducts,
  getOneProduct,
  createProduct,
  updateOneProduct,
  deleteOneProduct,
} = require("../controllers/products");

router.route("/").get(getAllProducts).post(validateUser, createProduct);
router
  .route("/:productId")
  .get(getOneProduct)
  .put(validateUser, updateOneProduct)
  .delete(validateUser, deleteOneProduct);

module.exports = router;
