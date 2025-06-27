const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
  } catch (error) {
    throw new Error("Failed to connect to MongoDB");
  }
}

module.exports = connectDB;
