const { query, validationResult } = require("express-validator");

exports.validateFlightSearch = [
  // FROM airport (IATA 3-letter code)
  query("from")
    .notEmpty()
    .withMessage("Departure IATA code (from) is required")
    .isLength({ min: 3, max: 3 })
    .withMessage("IATA codes must be 3 characters")
    .isAlpha()
    .withMessage("IATA code must contain only letters"),

  // TO airport (IATA 3-letter code)
  query("to")
    .notEmpty()
    .withMessage("Destination IATA code (to) is required")
    .isLength({ min: 3, max: 3 })
    .withMessage("IATA codes must be 3 characters")
    .isAlpha()
    .withMessage("IATA code must contain only letters"),

  // Outbound date
  query("outbound")
    .notEmpty()
    .withMessage("Outbound date is required")
    .isISO8601()
    .withMessage("Outbound date must be in YYYY-MM-DD format"),

  // Return date (optional)
  query("returnDate")
    .optional()
    .isISO8601()
    .withMessage("Return date must be in YYYY-MM-DD format"),

  // Flight type (1 = round, 2 = one-way, 3 = multi-city)
  query("flightType")
    .optional()
    .isIn(["1", "2", "3"])
    .withMessage(
      "Flight type must be 1 (round), 2 (one-way), or 3 (multi-city)"
    ),

  // Travel class (1 = Economy, 2 = Premium Economy, 3 = Business, 4 = First)
  query("travelClass")
    .optional()
    .isIn(["1", "2", "3", "4"])
    .withMessage("Travel class must be 1, 2, 3, or 4"),

  // Stops (0 = Any, 1 = Nonstop, 2 = 1 stop max, 3 = 2 stops max)
  query("stops")
    .optional()
    .isIn(["0", "1", "2", "3"])
    .withMessage("Stops must be 0, 1, 2, or 3"),

  // Airlines (comma-separated 2-character IATA codes or alliances)
  query("airlines")
    .optional()
    .custom((value) => {
      if (!value) return true;
      const parts = value.split(",");
      return parts.every(
        (code) =>
          /^[A-Z0-9]{2}$/.test(code) ||
          ["STAR_ALLIANCE", "SKYTEAM", "ONEWORLD"].includes(code)
      );
    })
    .withMessage(
      "Airlines must be comma-separated 2-character IATA codes or alliances (e.g., ET,TK or STAR_ALLIANCE)"
    ),

  // Final result handling
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// exports.validateFlightBooking = [
//   query("flight_id")
//     .notEmpty()
//     .withMessage("Flight ID is required")
//     .isMongoId()
//     .withMessage("Invalid Flight ID format"),
//   query("passenger_name")
//     .notEmpty()
//     .withMessage("Passenger name is required")
//     .isString()
//     .withMessage("Passenger name must be a string"),
//   query("passport_number")
//     .notEmpty()
//     .withMessage("Passport number is required")
//     .isString()
//     .withMessage("Passport number must be a string"),

//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   },
// ];
