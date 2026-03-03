const Post = require("../models/post");
const s3 = require("../config/s3");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

exports.createPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const fileName = Date.now() + "-" + req.file.originalname;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    const post = await Post.create({
      userId: req.user.id,
      image: imageUrl,
      likes: [],
    });

    res.status(201).json({
      message: "Post uploaded successfully",
      post,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};