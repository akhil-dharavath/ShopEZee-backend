const asyncHandler = require("express-async-handler");

// @desc - Handle payment processing using a third-party payment gateway like Stripe or PayPal.
// @route - POST /payment/process
// @access - private - user access
const processPayment = asyncHandler(async (req, res) => { // incomplete
  res.json("/payment/process");
});

module.exports = { processPayment };
