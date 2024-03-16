const express = require("express");
const router = express.Router();
const validateUser = require("../middlewares/validateUser");
const {
  getUserDetails,
  updateUserDetails,
  deleteUser,
} = require("../controllers/userProfile");

router.use(validateUser);
router.route("/").get(getUserDetails).put(updateUserDetails);
router.route("/").delete(deleteUser);

module.exports = router;
