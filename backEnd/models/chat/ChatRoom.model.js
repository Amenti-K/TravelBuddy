const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    chat_picture: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      enum: ["personal", "group"],
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuthInfo",
        required: true,
      },
    ],
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthInfo",
      required: true,
    },
    lastMessage: {
      text: String,
      timestamp: Date,
      senderName: String,
    },
  },
  {
    timestamps: true,
  }
);

const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
module.exports = ChatRoom;
