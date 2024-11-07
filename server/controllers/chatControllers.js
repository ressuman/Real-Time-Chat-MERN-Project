const Chat = require("../models/chat");

exports.createNewChat = async (req, res) => {
  try {
    // Ensure 'members' field is present and has exactly two unique members
    if (!req.body.members || req.body.members.length !== 2) {
      return res.status(400).send({
        message: "Chat must have exactly two members.",
        success: false,
      });
    }

    // Ensure that the two members have unique IDs
    if (req.body.members[0] === req.body.members[1]) {
      return res.status(400).send({
        message: "A user cannot create a chat with themselves.",
        success: false,
      });
    }

    // Create and save the new chat
    const chat = new Chat(req.body);
    const savedChat = await chat.save();

    // Populate 'members' with user details if needed
    await savedChat.populate("members");

    res.status(201).send({
      message: "Chat created successfully",
      success: true,
      data: savedChat,
    });
  } catch (error) {
    // Handling validation vs other errors
    if (error.name === "ValidationError") {
      res.status(400).send({
        message: `Validation Error: ${error.message}`,
        success: false,
      });
    } else {
      res.status(500).send({
        message: `Server Error: ${error.message}`,
        success: false,
      });
    }
  }
};

exports.getAllChats = async (req, res) => {
  try {
    const userId = req.body.userId;

    // Check if the userId is provided
    if (!userId) {
      return res.status(400).send({
        message: "User ID is required to fetch chats.",
        success: false,
      });
    }

    // Fetch all chats where the user is a member, sorted by most recent
    const allChats = await Chat.find({ members: { $in: [userId] } })
      .populate({
        path: "members",
        select: "firstName lastName profilePic",
      })
      .populate({
        path: "lastMessage",
        select: "text createdAt senderId",
      })
      .sort({ updatedAt: -1 });

    // Check if chats were found for the user
    if (!allChats || allChats.length === 0) {
      return res.status(404).send({
        message: "No chats found for this user.",
        success: false,
      });
    }

    res.status(200).send({
      message: "Chats fetched successfully",
      success: true,
      chatCount: allChats.length,
      data: allChats,
    });
  } catch (error) {
    // Catch any server-side errors and respond accordingly
    res.status(500).send({
      message: `Server Error: ${error.message}`,
      success: false,
    });
  }
};

// exports.clearUnreadMessages = async (req, res) => {
//   try {
//   } catch (error) {}
// };
