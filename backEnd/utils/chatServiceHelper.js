const ChatRoom = require("../models/chat/ChatRoom.model");

exports.createTripGroupChat = async (trip) => {
  return await ChatRoom.create({
    type: "group",
    tripId: trip._id,
    name: trip.trip_name,
    chat_picture: trip.trip_pictures[0] || null,
    participants: [trip.organizer_id],
    createdBy: trip.organizer_id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

exports.addParticipantsToGroupChat = async ({ tripId, participantIds }) => {
  const chatRoom = await ChatRoom.findOne({ tripId });
  if (!chatRoom) {
    throw new Error("Chat room not found");
  }
  chatRoom.participants.push(...participantIds);
  chatRoom.updatedAt = new Date();
  await chatRoom.save();
  return chatRoom;
};
