const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  },
  sender: {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthInfo",
      required: true,
    },
    fullName: { type: String, required: true },
    profilePicture: { type: String },
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  seenBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthInfo",
    },
  ],
});

// Index for faster querying of messages by chatId
MessageSchema.index({ chatId: 1, timestamp: -1 });

MessageSchema.statics.fetchRecentMessages = async function (
  chatId,
  beforeDate = new Date()
) {
  limit = 10;
  const daysToFetch = 5;
  const startDate = new Date(beforeDate);
  startDate.setDate(startDate.getDate() - daysToFetch);

  const messages = await this.find({
    chatId,
    timestamp: { $lt: beforeDate },
  })
    .sort({ timestamp: -1 })
    .limit(limit);
  const hasMore = await this.exists({
    chatId,
    timestamp: { $lt: messages[messages.length - 1]?.timestamp },
  });
  return { messages: messages.reverse(), hasMore: Boolean(hasMore) };
};

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
