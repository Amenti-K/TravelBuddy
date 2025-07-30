const express = require("express");
const router = express.Router();
const {
  fetchUserChats,
  fetchMessages,
  getOrCreatePersonalChat,
} = require("../controllers/Chat.Controller");

// Get all chats the user is in
router.get("/rooms/:userId", fetchUserChats);

// Get all messages for a chat
router.get("/messages/:chatId", fetchMessages);

// Optional/Later: Get or Create private chat
router.get("/private", getOrCreatePersonalChat);

module.exports = router;
