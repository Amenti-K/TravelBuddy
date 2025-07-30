const mongoose = require("mongoose");
const {
  fetchDiscoverTrips,
  fetchNormalTrips,
} = require("../utils/tripsModelHelper");

const TripSchema = new mongoose.Schema(
  {
    trip_name: { type: String, required: true },
    trip_description: { type: String },
    departure_date: { type: Date, required: true },
    returning_date: { type: Date, required: true },
    flexible_dates: { type: Boolean, default: true },
    starting_location: { type: String, required: true },
    destination: { type: String, required: true },
    path: [{ type: String }], // Ordered list of locations between start and destination
    max_participants: { type: Number, default: null },
    organizer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthInfo",
      required: true,
    },
    trip_status: {
      type: String,
      enum: ["coming soon", "ongoing", "completed"],
      default: "coming soon",
    },
    trip_pictures: [{ type: String }],
    flight_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flights",
      default: null,
      select: false,
    },
    hotel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotels",
      default: null,
      select: false,
    },

    // Categories for better filtering
    category: [
      {
        type: String,
        enum: [
          "adventure",
          "beach",
          "historical",
          "nature",
          "luxury",
          "budget",
          "cultural",
          "wildlife",
          "snow",
          "festival",
          "roadtrip",
          "camping",
          "photography",
          "extreme",
          "relaxation",
          "sports",
          "cruise",
        ],
      },
    ],

    // Activities and Sightseeing
    activities: [
      {
        name: { type: String },
        description: { type: String },
        location: { type: String },
        date: { type: Date, select: false },
        time: { type: String, select: false },
        optional: { type: Boolean, default: false },
      },
    ],

    // Transportation
    transportation: [
      {
        type: {
          type: String,
          enum: ["flight", "train", "bus", "car rental", "other"],
        },
        provider: { type: String },
        details: { type: String },
        departure_time: { type: Date, select: false },
        arrival_time: { type: Date, select: false },
      },
    ],

    // Budget and Expenses
    // For solo travelers
    expenses: {
      estimated_per_person: { type: Number, default: 0 },
      breakdown: {
        transportation: { type: Number, default: 0 },
        accommodation: { type: Number, default: 0 },
        meals: { type: Number, default: 0 },
        activities: { type: Number, default: 0 },
        miscellaneous: { type: Number, default: 0 },
      },
    },
    // For travel agencies
    agency_fee: {
      cost: { type: Number, default: 0 },
      includes: [{ type: String }],
    },

    // Packing List
    packing_list: [
      {
        item: { type: String },
        category: {
          type: String,
          enum: [
            "clothing",
            "toiletries",
            "documents",
            "electronics",
            "miscellaneous",
          ],
        },
      },
    ],

    // Travel Documents Checklist
    required_documents: [
      {
        document_name: { type: String },
        required_for_entry: { type: Boolean, default: false },
        required_for_trip: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

// Indexing fields for faster lookups
TripSchema.index({ trip_status: 1 });
TripSchema.index({ category: 1 });
TripSchema.index({ destination: 1 });
TripSchema.index({ departure_date: 1 });
TripSchema.index({ returning_date: 1 });

TripSchema.statics.getTrips = async function (filters = {}, options = {}) {
  const today = new Date();
  const discover = options.discover || false;
  const skip = options.skip || 0;
  const limit = options.limit || 20;
  const projectionFields = {
    _id: 1,
    trip_name: 1,
    trip_description: 1,
    destination: 1,
    departure_date: 1,
    returning_date: 1,
    trip_status: 1,
    "agency_fee.cost": 1,
    category: 1,
    trip_pictures: 1,
    "expenses.estimated_per_person": 1,
  };

  if (discover) {
    return fetchDiscoverTrips(
      this,
      projectionFields,
      (userPreferences = filters),
      skip,
      limit
    );
    // return fetchDiscoverTrips(this, projectionFields, filters, skip, limit);
  } else {
    return fetchNormalTrips(
      this,
      projectionFields,
      filters,
      skip,
      limit,
      today
    );
  }
};

TripSchema.methods.getLessDetails = function () {
  // Letter will be structured well to what to see for none participants
  return {
    _id: this._id,
    trip_name: this.trip_name,
    trip_description: this.trip_description,
    destination: this.destination,
    departure_date: this.departure_date,
    returning_date: this.returning_date,
    trip_status: this.trip_status,
    agency_fee: this.agency_fee?.cost || 0,
    activities: this.activities,
    packing_list: this.packing_list,
    trip_pictures: this.trip_pictures || [],
  };
};

TripSchema.methods.getFullDetails = async function () {
  const fullTrip = await Trip.findById(this._id)
    .select(
      "+flight_id +hotel_id +activities.date +activities.time +transportation.departure_time +transportation.arrival_time"
    )
    .lean()
    .exec();

  return fullTrip;
};

const Trip = mongoose.model("Trip", TripSchema);

module.exports = Trip;
