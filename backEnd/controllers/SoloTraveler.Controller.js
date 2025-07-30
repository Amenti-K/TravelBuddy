const SoloTraveler = require("../models/SoloTraveler.model");
const { deleteImage } = require("../config/cloudinaryConfig");
const {
  findAndCompose,
  composeMinimalAuthProfile,
} = require("../utils/userProfile");

const createSoloTravelerProfile = async (req, res) => {
  try {
    let uploadErrors = [];
    let profileData = {
      ...req.body,
    };
    if (req.files?.profile_picture) {
      try {
        profileData.profile_picture =
          req.files.profile_picture[0].path ||
          `${req.body.full_name} profile picture`;
      } catch {
        uploadErrors.push(
          "Failed to upload new profile picture. Try again later."
        );
      }
    }
    const profile = new SoloTraveler(profileData);
    await profile.save();
    await profile.calculateTrustScore();
    const minimalProfile = await composeMinimalAuthProfile(req.user);

    const response = {
      success: true,
      message: "Profile created successfully",
      user_profile: minimalProfile,
    };
    if (uploadErrors.length > 0) {
      response.warning = uploadErrors;
    }
    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const getSoloTravelerProfile = async (req, res) => {
  try {
    const profile = await SoloTraveler.findOne({ user_id: req.params.user_id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }
    res.json({ success: true, profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get many SoloTravelers adjust for better calling
const getSoloTravelers = async (req, res) => {
  try {
    const soloTravelers = await SoloTraveler.getSoloTravelers();

    res.json({ success: true, soloTravelers });
  } catch (error) {}
};

const updateSoloTravelerProfile = async (req, res) => {
  try {
    const profile = await SoloTraveler.findOne({ user_id: req.params.user_id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    let uploadErrors = [];
    let updatedFields = {
      ...req.body,
    };

    // Handle profile picture update
    if (req.files?.profile_picture) {
      try {
        // Delete old images before replacing them
        await deleteImage(profile.profile_picture);
        updatedFields.profile_picture = req.files.profile_picture[0].path;
      } catch (error) {
        uploadErrors.push(
          "Failed to upload new profile picture. Try again later."
        );
      }
    }
    if (req.body.interests) {
      updatedFields.interests = Array.isArray(req.body.interests)
        ? req.body.interests
        : JSON.parse(req.body.interests);
    }
    if (req.body.social_media) {
      updatedFields.social_media = Array.isArray(req.body.social_media)
        ? req.body.social_media
        : JSON.parse(req.body.social_media);
    }

    // Update the profile with new values
    const updatedProfile = await SoloTraveler.findOneAndUpdate(
      { user_id: req.params.user_id },
      { $set: updatedFields },
      { new: true, runValidators: true }
    );
    await updatedProfile.calculateTrustScore();

    // Send response
    const response = {
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
    };

    if (uploadErrors.length > 0) {
      response.warning = uploadErrors;
    }

    res.json(response);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteSoloTravelerProfile = async (req, res) => {
  try {
    const profile = await SoloTraveler.findOne({ user_id: req.params.user_id });

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    // Delete image from Cloudinary
    if (profile.profile_picture) {
      await deleteImage(profile.profile_picture);
    }

    // Delete profile from database
    await SoloTraveler.findOneAndDelete({ user_id: req.params.user_id });

    res.json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  createSoloTravelerProfile,
  getSoloTravelerProfile,
  getSoloTravelers,
  updateSoloTravelerProfile,
  deleteSoloTravelerProfile,
};
