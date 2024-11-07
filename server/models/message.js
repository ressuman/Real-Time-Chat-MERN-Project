const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chats",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    text: {
      type: String,
      required: false,
      trim: true,
    },
    image: {
      type: String,
      required: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Messages", messageSchema);
