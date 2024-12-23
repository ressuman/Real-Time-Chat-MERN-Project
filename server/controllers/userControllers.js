const User = require("../models/user");
const cloudinary = require("./../cloudinary");

exports.getLoggedUser = async (req, res) => {
  try {
    //const user = await User.findOne({ _id: req.body.userId });
    const user = await User.findById(req.body.userId);

    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).send({
      message: "User fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching user: " + error.message,
      success: false,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const userId = req.body.userId;

    // Find all users except the current user
    const allUsers = await User.find({ _id: { $ne: userId } });

    if (allUsers.length === 0) {
      return res.status(404).send({
        message: "No other users found",
        success: false,
      });
    }

    res.status(200).send({
      message: "All users fetched successfully",
      success: true,
      count: allUsers.length,
      data: allUsers,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching users: " + error.message,
      success: false,
    });
  }
};

exports.uploadProfilePic = async (req, res) => {
  try {
    const { image, userId } = req.body;

    // Validate request body
    // if (!image || !userId) {
    //   return res.status(400).send({
    //     message: "Image and userId are required.",
    //     success: false,
    //   });
    // }

    // Upload the image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: "ressuman-mern-realtime-chat-quik-chat-image-storage",
    });

    // Validate Cloudinary response
    if (!uploadedImage || !uploadedImage.secure_url) {
      return res.status(500).send({
        message: "Failed to upload image to Cloudinary.",
        success: false,
      });
    }

    // Update the user's profile picture
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadedImage.secure_url },
      { new: true }
    );

    // Check if user was found and updated
    if (!user) {
      return res.status(404).send({
        message: "User not found.",
        success: false,
      });
    }

    res.status(200).send({
      message: "Profile picture uploaded successfully.",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
};
