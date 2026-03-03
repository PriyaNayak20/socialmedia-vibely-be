const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: Number, 
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Number, 
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);