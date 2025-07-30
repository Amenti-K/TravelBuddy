const {
  sendMessage,
  markAsSeen,
  getUnseenCounts,
} = require("../controllers/Chat.Controller");

function chatSocketHandler(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Join all rooms related to the user
    socket.on("joinRooms", ({ userId, chatIds }) => {
      chatIds.forEach((chatId) => socket.join(chatId));
    });

    // User sends a message
    socket.on("sendMessage", async ({ chatId, senderId, text, tempId }) => {
      const message = (
        await sendMessage({ chatId, senderId, text })
      ).toObject();
      io.to(chatId).emit("newMessage", { ...message, tempId });
    });

    // Mark chat as seen
    socket.on("markAsSeen", async ({ chatId, userId }) => {
      await markAsSeen(chatId, userId);
    });

    // When user logs in or opens chat UI
    socket.on("getUnseenCounts", async ({ userId }, callback) => {
      const counts = await getUnseenCounts(userId);
      callback(counts);
    });

    // Clean disconnect
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}

module.exports = chatSocketHandler;
