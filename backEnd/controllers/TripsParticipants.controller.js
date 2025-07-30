const TripParticipants = require("../models/TripParticipants.model");
const SoloTraveler = require("../models/SoloTraveler.model");
const { addParticipantsToGroupChat } = require("../utils/chatServiceHelper");

// Request to join a trip
exports.requestToJoin = async (req, res) => {
  try {
    const { trip_id } = req.params;
    const user_id = req.user._id;
    const userExists = await SoloTraveler.userExists(user_id);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    await TripParticipants.findOneAndUpdate(
      { trip_id },
      { $push: { participants: { user_id, status: "pending" } } },
      { new: true }
    );

    res.json({ success: true, message: "Wating for approval, Pending." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all participants of a trip
exports.getTripParticipants = async (req, res) => {
  try {
    const { trip_id } = req.params;
    const result = await TripParticipants.pendingTripParticipants(trip_id);
    res.json({ success: true, tripParticipants: result });
  } catch (error) {
    console.error("Error fetching trip participants:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve participant
exports.updateParticipantStatus = async (req, res) => {
  try {
    const { user_id, status } = req.body;
    const { trip_id } = req.params; // Using params

    if (!["approved", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await TripParticipants.findOneAndUpdate(
      { trip_id, "participants.user_id": user_id },
      { $set: { "participants.$.status": status } },
      { new: true }
    );
    if (status === "approved") {
      await addParticipantsToGroupChat({
        tripId: trip_id,
        participantIds: [user_id],
      });
    }

    res.json({ success: true, message: "User approved to join." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Leave trip or cancel request (using params for trip_id)
exports.leaveTrip = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { trip_id } = req.params;

    await TripParticipants.findOneAndUpdate(
      { trip_id },
      { $pull: { participants: { user_id } } },
      { new: true }
    );

    res.json({
      success: true,
      message: "Successfully leave/rejected/canceled",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
