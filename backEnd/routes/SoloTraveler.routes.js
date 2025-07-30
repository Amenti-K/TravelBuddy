const express = require("express");
const router = express.Router();
const {
  validateSoloTravelerProfile,
  validateSoloTravelerUpdate,
} = require("../middlewares/validation/SoloTravelerValidataion");
const {
  createSoloTravelerProfile,
  getSoloTravelerProfile,
  updateSoloTravelerProfile,
  deleteSoloTravelerProfile,
} = require("../controllers/SoloTraveler.Controller");
const conditionalUpload = require("../middlewares/conditionalUpload");

// Create a new solo traveler profile with profile picture
router.post(
  "/create-profile",
  conditionalUpload,
  validateSoloTravelerProfile,
  createSoloTravelerProfile
);

// Get a solo traveler profile by user_id
router.get("/:user_id", getSoloTravelerProfile);

// Update a solo traveler profile
router.put(
  "/update-profile/:user_id",
  conditionalUpload,
  validateSoloTravelerUpdate,
  updateSoloTravelerProfile
);

// Delete a solo traveler profile
router.delete("/delete-profile/:user_id", deleteSoloTravelerProfile);

module.exports = router;
