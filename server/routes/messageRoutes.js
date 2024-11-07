const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  newMessage,
  getAllMessagesPerChatId,
} = require("../controllers/messageControllers");

const router = express.Router();

router.post("/new-message", authMiddleware, newMessage);

router.get(
  "/get-all-messages/:chatId",
  authMiddleware,
  getAllMessagesPerChatId
);

module.exports = router;
