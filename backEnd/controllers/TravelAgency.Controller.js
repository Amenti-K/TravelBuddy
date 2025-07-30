const TravelAgency = require("../models/TravelAgency.model");
const { deleteImage } = require("../config/cloudinaryConfig");
const {
  findAndCompose,
  composeMinimalAuthProfile,
} = require("../utils/userProfile");

const createTravelAgencyProfile = async (req, res) => {
  try {
    let uploadErrors = [];
    let profileData = {
      ...req.body,
    };
    if (req.files?.profile_picture) {
      try {
        profileData.profile_picture =
          req.files.profile_picture[0].path ||
          `${req.body.agency_name} profile picture`;
      } catch (error) {
        uploadErrors.push("Failed to upload profile picture. Try again later.");
      }
    }
    const profile = new TravelAgency(profileData);
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
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getTravelAgencyProfile = async (req, res) => {
  try {
    const profile = await TravelAgency.findOne({
      agency_id: req.params.agency_id,
    });
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

const updateTravelAgencyProfile = async (req, res) => {
  try {
    // Find existing profile
    const profile = await TravelAgency.findOne({
      agency_id: req.params.agency_id,
    });
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
    const updatedProfile = await TravelAgency.findOneAndUpdate(
      { agency_id: req.params.agency_id },
      { $set: updatedFields },
      { new: true, runValidators: true }
    );
    await profile.calculateTrustScore();

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

const deleteTravelAgencyProfile = async (req, res) => {
  try {
    const agency = await TravelAgency.findOne({
      agency_id: req.params.agency_id,
    });
    if (!agency) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }
    if (agency.profile_picture) {
      await deleteImage(profile.profile_picture);
    }

    const profile = await TravelAgency.findOneAndDelete({
      agency_id: req.params.agency_id,
    });
    res.json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  createTravelAgencyProfile,
  getTravelAgencyProfile,
  updateTravelAgencyProfile,
  deleteTravelAgencyProfile,
};
