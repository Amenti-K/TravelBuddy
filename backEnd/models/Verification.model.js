const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user_type: {
      type: String,
      enum: ["solo_traveler", "agency"],
      required: true,
    },
    primary_image: {
      type: String, // URL to the stored image
      required: true,
    },
    secondary_image: {
      type: String, // URL to the stored image
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    verification_date: {
      type: Date,
      default: Date.now,
    },
    reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    review_date: {
      type: Date,
      required: false,
    },
    rejection_reason: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
verificationSchema.index({ user: 1, user_type: 1 });
verificationSchema.index({ status: 1 });

const Verification = mongoose.model("Verification", verificationSchema);

module.exports = Verification; 