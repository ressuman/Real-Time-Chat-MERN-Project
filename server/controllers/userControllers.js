const User = require("../models/user");

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

// exports.uploadProfilePic = async (req, res) => {
//   try {
//   } catch (error) {
//     res.status(400).send({
//       message: error.message,
//       success: false,
//     });
//   }
// };
