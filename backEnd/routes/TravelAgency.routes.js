const express = require("express");
const router = express.Router();
const {
  validateTravelAgencyProfile,
  validateTravelAgencyUpdate,
} = require("../middlewares/validation/TravelAgencyValidation");
const {
  createTravelAgencyProfile,
  getTravelAgencyProfile,
  updateTravelAgencyProfile,
  deleteTravelAgencyProfile,
} = require("../controllers/TravelAgency.Controller");
const conditionalUpload = require("../middlewares/conditionalUpload");

// Create a new travel agency profile
router.post(
  "/create-profile",
  conditionalUpload,
  validateTravelAgencyProfile,
  createTravelAgencyProfile
);

// Get a travel agency profile by agency_id
router.get("/get-profile/:agency_id", getTravelAgencyProfile);

// Update a travel agency profile
router.put(
  "/update-profile/:agency_id",
  conditionalUpload,
  validateTravelAgencyUpdate,
  updateTravelAgencyProfile
);

// Delete a travel agency profile
router.delete("/delete-profile/:agency_id", deleteTravelAgencyProfile);

module.exports = router;

// const logRequestDetails = (req, res, next) => {
//   console.log("---- Incoming Request ----");
//   console.log("Method:", req.method);
//   console.log("URL:", req.originalUrl);
//   console.log("Content-Type:", req.headers["content-type"]);
//   if (
//     req.headers["content-type"] &&
//     req.headers["content-type"].includes("multipart")
//   ) {
//     console.log("Request is multipart/form-data");
//   } else {
//     console.log("Request is NOT multipart/form-data");
//   }
//   console.log("Body:", req.body);
//   console.log("----------  ---------------");
//   next();
// };
