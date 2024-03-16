const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    // connect to database
    await mongoose.connect(process.env.CONNECTION_STRING);
    // console.log('Connected to database');
  } catch (error) {
    // catch error while connecting to database
    console.log(error);
    process.exit(1);
  }
};

module.exports = dbConnection;
