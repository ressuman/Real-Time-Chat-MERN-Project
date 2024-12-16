const Chat = require("../models/chat");
const Message = require("../models/message");
const mongoose = require("mongoose");

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
      .populate("members")
      .populate("lastMessage")
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

exports.clearUnreadMessages = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    // 1. Validate chatId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).send({
        message: "Invalid chat ID provided.",
        success: false,
      });
    }

    // 2. Fetch the chat and validate existence
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).send({
        message: "No chat found with the given chat ID.",
        success: false,
      });
    }

    // 3. Ensure the user is a participant of the chat
    const isUserInChat = chat.members.some(
      (memberId) => memberId.toString() === userId
    );
    if (!isUserInChat) {
      return res.status(403).send({
        message:
          "User is not authorized to clear unread messages for this chat.",
        success: false,
      });
    }

    // 4. Update the unread message count to 0 in the chat collection
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { unreadMessageCount: 0 },
      { new: true }
    )
      .populate("members")
      .populate("lastMessage");

    // 5. Update all unread messages in the message collection for the chat
    const updatedMessages = await Message.updateMany(
      { chatId: chatId, read: false },
      { read: true }
    );

    res.status(200).send({
      message: "Unread messages cleared successfully.",
      success: true,
      data: updatedChat,
      updatedMessagesCount: updatedMessages.modifiedCount, // Optional, tracks updated messages
    });
  } catch (error) {
    res.status(500).send({
      message: `Server error: ${error.message}`,
      success: false,
    });
  }
};
