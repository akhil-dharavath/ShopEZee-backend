const express = require("express");
const cors = require("cors");
const dbConnection = require("./config/dbConnection");
require("dotenv").config();
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const port = process.env.PORT || 80;

// connect to database
dbConnection();

// to access entered details form user
app.use(express.json());
// to access environment variables
app.use(cors());

// middleware
app.use("/users", require("./routes/userAuthentication"));
app.use("/products", require("./routes/productManagement"));
app.use("/cart", require("./routes/shoppingCart"));
app.use("/orders", require("./routes/orderManagement"));
app.use("/users", require("./routes/userProfileManagement"));
app.use("/payment", require("./routes/paymentProcessing"));
app.use("/filters", require("./routes/categoryAndSearch"));
app.use("/products", require("./routes/reviewsAndRatings"));
app.use("/admin", require("./routes/adminFeatures"));
app.use("/contact-us", require("./routes/contactUs"));
app.use("*", (req, res) => {
  res.status(404);
  throw new Error("Endpoint Not found");
});
app.use(errorHandler);

app.listen(port, () => {
  console.log("Server listening on port:", port);
});
