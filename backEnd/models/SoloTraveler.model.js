const mongoose = require("mongoose");
const AuthInfo = require("../models/AuthInfo");

const SoloTravelerSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthInfo",
      required: true,
      unique: true,
    },
    full_name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    profile_picture: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 255,
    },
    location: {
      type: String,
      required: true,
    },
    social_media: {
      type: [String], // Array of social media links
      default: [],
    },
    interests: {
      type: [String], // Array of interests
      required: true,
    },
    verification_doc: {
      type: String,
    },
    trust_score: {
      type: Number,
      default: 40, // Default trust score for all users
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Check if Solo Traveler exists
SoloTravelerSchema.statics.userExists = async function (user_id) {
  const user = await this.findOne({ user_id });
  return !!user;
};

// Calculate Trust Score (Called when profile is updated)
SoloTravelerSchema.methods.calculateTrustScore = async function () {
  const authInfo = await AuthInfo.findById(this.user_id);

  let score = 40;

  // Check AuthInfo fields
  if (authInfo?.is_verified) score += 20;

  // Check SoloTraveler fields
  if (this.profile_picture) score += 10;
  if (this.bio) score += 10;
  if (this.social_media.length > 0) score += 15;

  this.trust_score = Math.min(score, 100);
  await this.save();
};

SoloTravelerSchema.statics.getSoloTravelers = async function (query) {
  const soloTravelers = await this.find(query)
    .select("user_id full_name gender profile_picture trust_score")
    .sort({ trust_score: -1 })
    .lean();

  if (!soloTravelers) {
    return [];
  }

  return soloTravelers.map((soloTraveler) => ({
    user_id: soloTraveler.user_id,
    full_name: soloTraveler.full_name,
    gender: soloTraveler.gender,
    profile_picture: soloTraveler.profile_picture,
    trust_score: soloTraveler.trust_score || 40,
  }));
};

SoloTravelerSchema.statics.getMinimalProfile = async function (user_id) {
  const soloTraveler = await this.findOne({ user_id })
    .select(
      "user_id full_name profile_picture bio location interests trust_score"
    )
    .lean();

  if (!soloTraveler) return null;
  soloTraveler.user_type = "solo_traveler";
  return soloTraveler;
};

const SoloTraveler = mongoose.model("SoloTraveler", SoloTravelerSchema);
module.exports = SoloTraveler;
