const mongoose = require("mongoose");
const { findAndMinimal } = require("../utils/userProfile");

const TripParticipantsSchema = new mongoose.Schema(
  {
    trip_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    participants: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "AuthInfo",
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "approved"],
          default: "pending",
        },
      },
    ],
  },
  { timestamps: true }
);

TripParticipantsSchema.statics.isUserMember = async function (
  trip_id,
  user_id
) {
  const participant = await this.findOne({
    trip_id,
    "participants.user_id": user_id,
  });
  return participant ? true : false;
};

TripParticipantsSchema.statics.pendingTripParticipants = async function (
  trip_id
) {
  const participantsDoc = await this.findOne({ trip_id });
  if (!participantsDoc) {
    return {
      trip_id,
      participants: [],
    };
  }

  const pendingParticipants = participantsDoc.participants
    .filter((p) => p.status === "pending")
    .sort((a, b) => b._id.getTimestamp() - a._id.getTimestamp());
  console.log("pending par: ", pendingParticipants);

  const enriched = await Promise.all(
    pendingParticipants.map(async (p) => {
      const userMinimal = await findAndMinimal(p.user_id);
      return {
        ...userMinimal,
        status: p.status,
      };
    })
  );

  return {
    trip_id,
    participants: enriched,
  };
};

const TripParticipants = mongoose.model(
  "TripParticipants",
  TripParticipantsSchema
);

module.exports = TripParticipants;
