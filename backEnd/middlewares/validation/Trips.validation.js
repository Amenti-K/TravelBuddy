const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

// Trip Validation
const validateTripCreation = [
  body("trip_name").notEmpty().withMessage("Trip name is required.").isString(),
  body("trip_description").optional().isString(),
  body("departure_date")
    .notEmpty()
    .withMessage("Departure date is required.")
    .isISO8601()
    .toDate(),
  body("returning_date")
    .notEmpty()
    .withMessage("Returning date is required.")
    .isISO8601()
    .toDate()
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.departure_date)) {
        throw new Error("Returning date must be after departure date.");
      }
      return true;
    }),
  body("flexible_dates").optional().isBoolean(),
  body("starting_location")
    .notEmpty()
    .withMessage("Starting location is required.")
    .isString(),
  body("destination")
    .notEmpty()
    .withMessage("Destination is required.")
    .isString(),
  body("path").optional(),
  // body("path")
  //   .optional()
  //   .isArray()
  //   .withMessage("Path must be an array of strings."),
  body("path.*")
    .optional()
    .isString()
    .withMessage("Each path entry must be a string."),
  body("max_participants")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Max participants must be a positive integer."),
  body("organizer_id")
    .notEmpty()
    .withMessage("Organizer ID is required.")
    .isMongoId()
    .withMessage("Invalid organizer ID."),
  body("trip_status")
    .optional()
    .isIn(["coming soon", "ongoing", "completed"])
    .withMessage(
      "Trip status must be 'coming soon', 'ongoing', or 'completed'."
    ),

  // New fields for trips pictures
  body("trip_pictures")
    .optional()
    .isArray()
    .withMessage("Trip pictures must be an array of image files or URLs.")
    .custom((value, { req }) => {
      if (!req.files && Array.isArray(value)) {
        return value.every((url) => {
          return /^https?:\/\/.*\.(jpg|jpeg|png|gif|bmp|webp)$/.test(url);
        });
      }
      if (!req.files && typeof value !== "string") {
        return false; // Must be a file or a URL string
      }
      return true;
    })
    .withMessage("Trip picture must be an image file or a valid URL"),
  //  New fields for trips category
  body("category").optional(),
  // body("category")
  //   .optional()
  //   .isArray()
  //   .withMessage("Category must be an array of strings."),
  body("category.*")
    .optional()
    .isIn([
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
    ])
    .withMessage(
      "Each category must be one of: 'adventure', 'beach', 'historical', 'nature', 'luxury', 'budget'."
    ),

  // New fields for activities
  body("activities").optional(),
  // body("activities")
  //   .optional()
  //   .isArray()
  //   .withMessage("Activities must be an array."),
  body("activities.*.name")
    .optional()
    .isString()
    .withMessage("Activity name must be a string."),
  body("activities.*.description")
    .optional()
    .isString()
    .withMessage("Activity description must be a string."),
  body("activities.*.location")
    .optional()
    .isString()
    .withMessage("Activity location must be a string."),
  body("activities.*.date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid activity date."),
  body("activities.*.time")
    .optional()
    .isString()
    .withMessage("Activity time must be a string."),
  body("activities.*.optional")
    .optional()
    .isBoolean()
    .withMessage("Activity optional flag must be a boolean."),

  // New fields for transportation
  body("transportation").optional(),
  // body("transportation")
  //   .optional()
  //   .isArray()
  //   .withMessage("Transportation must be an array."),
  body("transportation.*.type")
    .optional()
    .isIn(["flight", "train", "bus", "car rental", "other"])
    .withMessage("Invalid transportation type."),
  body("transportation.*.provider")
    .optional()
    .isString()
    .withMessage("Transportation provider must be a string."),
  body("transportation.*.details")
    .optional()
    .isString()
    .withMessage("Transportation details must be a string."),
  body("transportation.*.departure_time")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid transportation departure time."),
  body("transportation.*.arrival_time")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid transportation arrival time."),

  // New fields for expenses
  body("expenses.estimated_per_person")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Estimated per person must be a positive number."),
  body("expenses.breakdown")
    .optional()
    .isObject()
    .withMessage("Expenses breakdown must be an object."),
  body("expenses.breakdown.transportation")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Transportation expense must be a positive number."),
  body("expenses.breakdown.accommodation")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Accommodation expense must be a positive number."),
  body("expenses.breakdown.meals")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Meals expense must be a positive number."),
  body("expenses.breakdown.activities")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Activities expense must be a positive number."),
  body("expenses.breakdown.miscellaneous")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Miscellaneous expense must be a positive number."),

  // New fields for fee
  body("fee.agency_fee")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Agency fee must be a positive number."),
  body("fee.includes").optional(),
  // body("fee.includes")
  //   .optional()
  //   .isArray()
  //   .withMessage("Fee includes must be an array."),
  body("fee.includes.*")
    .optional()
    .isString()
    .withMessage("Each fee item must be a string."),

  // New fields for packing list
  body("packing_list").optional(),
  // body("packing_list")
  //   .optional()
  //   .isArray()
  //   .withMessage("Packing list must be an array."),
  body("packing_list.*.item")
    .optional()
    .isString()
    .withMessage("Packing item must be a string."),
  body("packing_list.*.category")
    .optional()
    .isIn([
      "clothing",
      "toiletries",
      "documents",
      "electronics",
      "miscellaneous",
    ])
    .withMessage(
      "Packing list category must be one of: 'clothing', 'toiletries', 'documents', 'electronics', 'miscellaneous'."
    ),

  // New fields for required documents
  body("required_documents").optional(),
  // body("required_documents")
  //   .optional()
  //   .isArray()
  //   .withMessage("Required documents must be an array."),
  body("required_documents.*.document_name")
    .optional()
    .isString()
    .withMessage("Document name must be a string."),
  body("required_documents.*.required_for_entry")
    .optional()
    .isBoolean()
    .withMessage("Required for entry must be a boolean."),
  body("required_documents.*.required_for_trip")
    .optional()
    .isBoolean()
    .withMessage("Required for trip must be a boolean."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Trip Update Validation
const validateTripUpdate = [
  body("trip_name").optional().isString(),
  body("trip_description").optional().isString(),
  body("departure_date").optional().isISO8601().toDate(),
  body("returning_date")
    .optional()
    .isISO8601()
    .toDate()
    .custom((value, { req }) => {
      if (
        req.body.departure_date &&
        new Date(value) <= new Date(req.body.departure_date)
      ) {
        throw new Error("Returning date must be after departure date.");
      }
      return true;
    }),
  body("flexible_dates").optional().isBoolean(),
  body("starting_location").optional().isString(),
  body("destination").optional().isString(),
  body("path").optional(),
  // body("path").optional().isArray(),
  body("path.*").optional().isString(),
  body("max_participants").optional().isInt({ min: 1 }),
  body("organizer_id").optional().isMongoId(),
  body("trip_status").optional().isIn(["coming soon", "ongoing", "completed"]),

  body("trip_pictures")
    .optional()
    .isArray()
    .withMessage("Trip pictures must be an array of image files or URLs.")
    .custom((value, { req }) => {
      if (!req.files && Array.isArray(value)) {
        return value.every((url) => {
          return /^https?:\/\/.*\.(jpg|jpeg|png|gif|bmp|webp)$/.test(url);
        });
      }
      if (!req.files && typeof value !== "string") {
        return false; // Must be a file or a URL string
      }
      return true;
    })
    .withMessage("Trip picture must be an image file or a valid URL"),
  // Updated validation for new fields (same as for creation)
  body("category").optional(),
  // body("category").optional().isArray(),
  body("category.*")
    .optional()
    .isIn(["adventure", "beach", "historical", "nature", "luxury", "budget"]),
  body("activities").optional(),
  // body("activities").optional().isArray(),
  body("activities.*.name").optional().isString(),
  body("activities.*.description").optional().isString(),
  body("activities.*.location").optional().isString(),
  body("activities.*.date").optional().isISO8601().toDate(),
  body("activities.*.time").optional().isString(),
  body("activities.*.optional").optional().isBoolean(),
  body("transportation").optional(),
  // body("transportation").optional().isArray(),
  body("transportation.*.type")
    .optional()
    .isIn(["flight", "train", "bus", "car rental", "other"]),
  body("transportation.*.provider").optional().isString(),
  body("transportation.*.details").optional().isString(),
  body("transportation.*.departure_time").optional().isISO8601().toDate(),
  body("transportation.*.arrival_time").optional().isISO8601().toDate(),
  body("expenses.estimated_per_person").optional().isFloat({ min: 0 }),
  body("expenses.breakdown").optional().isObject(),
  body("fee.agency_fee").optional().isFloat({ min: 0 }),
  body("fee.includes").optional(),
  body("packing_list").optional(),
  // body("fee.includes").optional().isArray(),
  // body("packing_list").optional().isArray(),
  body("packing_list.*.item").optional().isString(),
  body("packing_list.*.category")
    .optional()
    .isIn([
      "clothing",
      "toiletries",
      "documents",
      "electronics",
      "miscellaneous",
    ]),
  body("required_documents").optional(),
  // body("required_documents").optional().isArray(),
  body("required_documents.*.document_name").optional().isString(),
  body("required_documents.*.required_for_entry").optional().isBoolean(),
  body("required_documents.*.required_for_trip").optional().isBoolean(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateTripCreation,
  validateTripUpdate,
};
