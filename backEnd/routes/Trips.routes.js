const express = require("express");
const router = express.Router();
const {
  validateTripCreation,
  validateTripUpdate,
  validateTripParticipantsUpdate,
} = require("../middlewares/validation/Trips.validation");

const {
  createTrip,
  getMyCreatedTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  discoverOrFindTrips,
} = require("../controllers/Trips.controller");

const {
  requestToJoin,
  getTripParticipants,
  updateParticipantStatus,
  leaveTrip,
} = require("../controllers/TripsParticipants.controller");
const conditionalUpload = require("../middlewares/conditionalUpload");

// Trip Routes
router.post("/create", conditionalUpload, validateTripCreation, createTrip);
router.get("/get-one/:trip_id", getTrip);
router.get("/get-created", getMyCreatedTrips);
router.get("/discover", discoverOrFindTrips);
router.put(
  "/update/:trip_id",
  conditionalUpload,
  validateTripUpdate,
  updateTrip
);
router.delete("/delete/:trip_id", deleteTrip);

// Trip Participants Routes
router.put("/request-to-join/:trip_id", requestToJoin);
router.get("/get-participants/:trip_id", getTripParticipants);
router.put("/update-status/:trip_id", updateParticipantStatus);
router.delete("/leave/:trip_id", leaveTrip);

module.exports = router;
