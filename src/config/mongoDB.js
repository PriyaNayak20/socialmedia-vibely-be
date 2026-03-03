const mongoose = require("mongoose");

const connectMongo = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/social_posts");
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
};

module.exports = connectMongo;