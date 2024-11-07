const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const {
  createNewChat,
  getAllChats,
  clearUnreadMessages,
} = require("../controllers/chatControllers");

const router = express.Router();

router.post("/create-new-chat", authMiddleware, createNewChat);

router.get("/get-all-chats", authMiddleware, getAllChats);

// router.post("/clear-unread-message", authMiddleware, clearUnreadMessages);

module.exports = router;
