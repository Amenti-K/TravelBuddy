const ChatRoom = require("../models/chat/ChatRoom.model");
const Message = require("../models/chat/Message.model");
const UnseenMessageCount = require("../models/chat/UnSeenMessageCount.model");
const UnseenCount = require("../models/chat/UnSeenMessageCount.model");
const { findAndMinimal } = require("../utils/userProfile");

// --- REST-based Controllers ---
// Fetch chat rooms for a user
exports.fetchUserChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chatRooms = await ChatRoom.find({ participants: userId }).sort({
      updatedAt: -1,
    });
    const chatsWithCounts = await Promise.all(
      chatRooms.map(async (chat) => {
        const unseen = await UnseenMessageCount.findOne({
          chatId: chat._id,
          userId,
        });

        return {
          ...chat.toObject(),
          unseenCount: unseen ? unseen.count : 0,
        };
      })
    );
    return res.status(200).json(chatsWithCounts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Fetch messages for a chat room
exports.fetchMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const beforeDate = req.query.beforeDate
      ? new Date(req.query.beforeDate)
      : new Date();
    const { messages, hasMore } = await Message.fetchRecentMessages(
      chatId,
      beforeDate
    );
    return res.status(200).json({ messages, hasMore });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Later: Get or create a personal chat between two users
exports.getOrCreatePersonalChat = async (user1Id, user2Id) => {
  let chat = await ChatRoom.findOne({
    type: "personal",
    participants: { $all: [user1Id, user2Id] },
  });
  if (!chat) {
    chat = await ChatRoom.create({
      type: "personal",
      participants: [user1Id, user2Id],
      createdBy: user1Id,
    });
  }
  return chat;
};

// --- Socket-based Real-Time Controllers ---
exports.sendMessage = async ({ chatId, senderId, text }) => {
  const senderProfile = await findAndMinimal(senderId);
  if (!senderProfile) throw new Error("Sender not found");
  const sender = {
    senderId: senderId,
    fullName: senderProfile.full_name || senderProfile.agency_name,
    profilePicture: senderProfile.profile_picture,
  };
  const message = await Message.create({
    chatId,
    sender,
    text,
    timestamp: new Date(),
    seenBy: [senderId],
  });

  const chat = await ChatRoom.findById(chatId);
  chat.lastMessage = {
    text,
    timestamp: message.timestamp,
    senderName: message.sender.fullName,
  };
  chat.updatedAt = new Date();
  await chat.save();

  const otherParticipants = chat.participants.filter(
    (p) => p.toString() !== senderId
  );

  await Promise.all(
    otherParticipants.map(async (userId) => {
      const existing = await UnseenCount.findOne({ userId, chatId });
      if (existing) {
        existing.count += 1;
        await existing.save();
      } else {
        await UnseenCount.create({ userId, chatId, count: 1 });
      }
    })
  );

  return message;
};

exports.markAsSeen = async ({ chatId, userId }) => {
  await Message.updateMany(
    { chatId, seenBy: { $ne: userId } },
    { $addToSet: { seenBy: userId } }
  );
  await UnseenCount.findOneAndUpdate({ userId, chatId }, { count: 0 });
};

exports.getUnseenCounts = async ({ userId }) => {
  return await UnseenCount.find({ userId });
};
