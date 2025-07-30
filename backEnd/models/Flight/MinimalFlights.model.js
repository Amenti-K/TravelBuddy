const mongoose = require("mongoose");

const parameterSchema = new mongoose.Schema(
  {
    from: { type: String, required: true }, // IATA code
    to: { type: String, required: true },
    outbound: { type: String, required: true }, // YYYY-MM-DD
    returnDate: { type: String, default: null }, // null for one-way
    flightType: { type: Number, enum: [1, 2, 3] }, // e.g., 1 = one-way, 2 = roundtrip, 3 = multi-city
    travelClass: { type: Number, enum: [1, 2, 3, 4] }, // e.g., 1 = economy, 2 = business, 3 = first
    stops: { type: Number, enum: [0, 1, 2, 3] },
    bookingToken: { type: String, required: true },
  },
  { _id: false }
);

const minimalFlightSelectionSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      default: null,
    },
    searchParameters: parameterSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("MinimalFlights", minimalFlightSelectionSchema);
