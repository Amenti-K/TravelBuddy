const mongoose = require("mongoose");

const UnseenMessageCountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthInfo",
      required: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

UnseenMessageCountSchema.index({ userId: 1, chatId: 1 }, { unique: true });

UnseenMessageCountSchema.statics.incrementCount = async function (
  userId,
  chatId
) {
  const unseenMessageCount = await this.findOneAndUpdate(
    { userId, chatId },
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );
  return unseenMessageCount.count;
};
const UnseenMessageCount = mongoose.model(
  "UnseenMessageCount",
  UnseenMessageCountSchema
);
module.exports = UnseenMessageCount;
