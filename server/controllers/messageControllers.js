const mongoose = require("mongoose");
const Chat = require("../models/chat");
const Message = require("../models/message");

exports.newMessage = async (req, res) => {
  try {
    const { chatId, sender, text, image } = req.body;

    // Ensure required fields are present
    if (!chatId || !sender || (!text && !image)) {
      return res.status(400).send({
        message:
          "Chat ID, sender, and message content (text or image) are required.",
        success: false,
      });
    }

    // Check if the chat exists and contains exactly two members(enforcing one-on-one chat)
    const chat = await Chat.findById(chatId).populate("members");
    if (!chat) {
      return res.status(404).send({
        message: "Chat not found.",
        success: false,
      });
    }

    if (chat.members.length !== 2) {
      return res.status(400).send({
        message:
          "Invalid chat configuration.This chat can only have two members.",
        success: false,
      });
    }

    // Validate sender is one of the chat members
    // const isSenderMember = !chat.members.some(
    //   (member) => member._id.toString() === sender
    // );
    // if (!isSenderMember) {
    //   return res.status(403).send({
    //     message: "Sender is not authorized to send messages in this chat.",
    //     success: false,
    //   });
    // }

    // Create and save the new message
    const newMessage = new Message({
      chatId,
      sender,
      text,
      image,
    });
    const savedMessage = await newMessage.save();

    // Update chat's last message and increment unread message count
    await Chat.findByIdAndUpdate(
      chatId,
      {
        lastMessage: savedMessage._id,
        $inc: { unreadMessageCount: 1 },
      },
      { new: true }
    );

    res.status(201).send({
      message: "Message sent successfully",
      success: true,
      data: savedMessage,
    });
  } catch (error) {
    res.status(500).send({
      message: `Server Error: ${error.message}`,
      success: false,
    });
  }
};

exports.getAllMessagesPerChatId = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.body.userId; // Assuming user ID is provided in the request body or header

    // 1. Validate the chatId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).send({
        message: "Invalid chat ID provided.",
        success: false,
      });
    }

    // 2. Check if the chat exists and that the user is a member
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).send({
        message: "Chat not found.",
        success: false,
      });
    }

    // 3. Check if the requesting user is a member of the chat
    const isUserInChat = chat.members.some(
      (memberId) => memberId.toString() === userId
    );
    if (!isUserInChat) {
      return res.status(403).send({
        message: "User is not authorized to access messages for this chat.",
        success: false,
      });
    }

    // 4. Fetch and return all messages for the chat, sorted by creation time
    const allMessages = await Message.find({ chatId }).sort({ createdAt: 1 });

    res.status(200).send({
      message: "Messages fetched successfully",
      success: true,
      messageCount: allMessages.length,
      data: allMessages,
    });
  } catch (error) {
    // 5. Handle unexpected server errors
    res.status(500).send({
      message: `Server error: ${error.message}`,
      success: false,
    });
  }
};
