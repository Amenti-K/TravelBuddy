const mongoose = require("mongoose");
const AuthInfo = require("../models/AuthInfo");

const TravelAgencySchema = new mongoose.Schema(
  {
    agency_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthInfo",
      required: true,
      unique: true,
    },
    agency_name: {
      type: String,
      required: true,
    },
    agency_type: {
      type: String,
      enum: ["local", "international"],
      required: true,
    },
    profile_picture: {
      type: String, // Single profile picture URL
    },
    bio: {
      type: String,
      maxlength: 255,
    },
    office_location: {
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
      default: 40, // Default trust score for all agencies
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Check if agency exists
TravelAgencySchema.statics.agencyExists = async function (agency_id) {
  const agency = await this.findOne({ agency_id });
  return !!agency;
};

// Calculate Trust Score (Called when profile is updated)
TravelAgencySchema.methods.calculateTrustScore = async function () {
  const authInfo = await AuthInfo.findById(this.agency_id);

  let score = 40;

  // Check AuthInfo fields
  if (authInfo?.is_verified) score += 20;

  // Check TravelAgency fields
  if (this.profile_picture) score += 10;
  if (this.bio) score += 10;
  if (this.social_media.length > 0) score += 15;
  if (this.verification_doc) score += 10;

  this.trust_score = Math.min(score, 100);
  await this.save();
};

TravelAgencySchema.statics.getTravelAgencies = async function (query) {
  const travelAgencies = await this.find(query)
    .select("_id full_name gender profile_picture trust_score")
    .sort({ trust_score: -1 }) // Sort by highest trust score
    .lean();

  if (!travelAgencies) {
    return [];
  }

  return travelAgencies.map((travelAgency) => ({
    _id: travelAgency.agency_id,
    agency_name: travelAgency.agency_name,
    agency_type: travelAgency.agency_type,
    profile_picture: travelAgency.profile_picture,
    trust_score: travelAgency.trust_score || 40,
  }));
};

TravelAgencySchema.statics.getMinimalProfile = async function (agency_id) {
  const travelAgency = await this.findOne({ agency_id })
    .select(
      "agency_id agency_name profile_picture bio agency_type office_location interests trust_score"
    )
    .lean();

  if (!travelAgency) return null;
  travelAgency.user_type = "travel_agency";
  return travelAgency;
};

const TravelAgency = mongoose.model("TravelAgency", TravelAgencySchema);

module.exports = TravelAgency;
