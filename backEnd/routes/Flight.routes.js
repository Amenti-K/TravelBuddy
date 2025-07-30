const express = require("express");
const router = express.Router();
const {
  validateFlightSearch,
} = require("../middlewares/validation/Flight.validataion");
const {
  getAirports,
  getFlights,
  getSelectedFlights,
  saveSelectedFlights,
} = require("../controllers/Flight.Controller");

router.get("/getAirports", getAirports);

router.get("/getFlights", validateFlightSearch, getFlights);
router.get("/selectedFlights", getSelectedFlights);
router.post("/saveSelectedFlights", saveSelectedFlights);

module.exports = router;
