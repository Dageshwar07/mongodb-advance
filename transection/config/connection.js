const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/", {
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process on failure
  }
};

module.exports = connectDB;
