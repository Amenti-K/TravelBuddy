const Verification = require("../models/Verification.model");
const { uploadToCloudinary } = require("../utils/cloudinary");

// Upload verification images
exports.uploadVerification = async (req, res) => {
  try {
    const { user_type } = req.user;

    // Check if user already has a pending verification
    const existingVerification = await Verification.findOne({
      user: req.user._id,
      status: "pending",
    });

    if (existingVerification) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending verification request",
      });
    }

    if (!req.files || !req.files.primary_image) {
      return res.status(400).json({
        success: false,
        message: "Primary image is required",
      });
    }

    // Upload images to Cloudinary
    const primaryImageUrl = await uploadToCloudinary(
      req.files.primary_image[0].buffer
    );
    let secondaryImageUrl = null;

    if (req.files.secondary_image) {
      secondaryImageUrl = await uploadToCloudinary(
        req.files.secondary_image[0].buffer
      );
    }

    // Create verification record
    const verification = new Verification({
      user: req.user._id,
      user_type,
      primary_image: primaryImageUrl,
      secondary_image: secondaryImageUrl,
      status: "pending",
      verification_date: new Date(),
    });

    await verification.save();

    res.status(201).json({
      success: true,
      message: "Verification images uploaded successfully",
      verification,
    });
  } catch (error) {
    console.error("Verification upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error uploading verification images",
    });
  }
};

// Get verification status
exports.getVerificationStatus = async (req, res) => {
  try {
    const verification = await Verification.findOne({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "No verification found",
      });
    }

    res.json({
      success: true,
      verification,
    });
  } catch (error) {
    console.error("Get verification status error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching verification status",
    });
  }
};

// Admin: Review verification
exports.reviewVerification = async (req, res) => {
  try {
    const { status, rejection_reason } = req.body;
    const verification = await Verification.findById(req.params.id);

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "Verification not found",
      });
    }

    verification.status = status;
    verification.reviewed_by = req.user._id;
    verification.review_date = new Date();

    if (status === "rejected" && rejection_reason) {
      verification.rejection_reason = rejection_reason;
    }

    await verification.save();

    res.json({
      success: true,
      message: "Verification reviewed successfully",
      verification,
    });
  } catch (error) {
    console.error("Review verification error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error reviewing verification",
    });
  }
};
