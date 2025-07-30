const mongoose = require("mongoose");

const airportSchema = new mongoose.Schema(
  {
    name: String,
    id: String,
    time: String,
  },
  { _id: false }
);

const flightSchema = new mongoose.Schema(
  {
    departure_airport: airportSchema,
    arrival_airport: airportSchema,
    duration: Number,
    airplane: String,
    airline: String,
    airline_logo: String,
    travel_class: String,
    flight_number: String,
    legroom: String,
    extensions: [String],
    overnight: { type: Boolean, default: false },
  },
  { _id: false }
);

const layoverSchema = new mongoose.Schema(
  {
    duration: Number,
    name: String,
    id: String,
    overnight: { type: Boolean, default: false },
  },
  { _id: false }
);

const carbonEmissionsSchema = new mongoose.Schema(
  {
    this_flight: Number,
    typical_for_this_route: Number,
    difference_percent: Number,
  },
  { _id: false }
);

const flightGroupSchema = new mongoose.Schema(
  {
    flights: [flightSchema],
    layovers: [layoverSchema],
    total_duration: Number,
    carbon_emissions: carbonEmissionsSchema,
    type: String,
    airline_logo: String,
  },
  { _id: false }
);

const bookingOptionSchema = new mongoose.Schema(
  {
    book_with: String,
    airline_logos: [String],
    marketed_as: [String],
    price: Number,
    local_prices: [
      {
        currency: String,
        price: Number,
      },
    ],
    baggage_prices: [String],
    booking_request: {
      url: String,
      post_data: String,
    },
  },
  { _id: false }
);

const baggagePricesSchema = new mongoose.Schema(
  {
    together: [String],
  },
  { _id: false }
);

const selectedFlightsSchema = new mongoose.Schema(
  {
    flights: [flightGroupSchema],
    baggage_prices: baggagePricesSchema,
    booking_options: [bookingOptionSchema],
  },
  { _id: false }
);

const flightSelectionSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      default: null,
    },
    selected_flights: selectedFlightsSchema,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Flights", flightSelectionSchema);
