const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

exports.validateTravelAgencyProfile = [
  body("agency_id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid agency ID"),
  body("agency_name").notEmpty().withMessage("Agency name is required"),
  body("agency_type")
    .isIn(["local", "international"])
    .withMessage("Invalid agency type"),
  // Optional fields
  body("profile_picture")
    .optional()
    .custom((value, { req }) => {
      if (!req.file && typeof value !== "string") {
        return false; // Must be a file or a URL
      }
      return true;
    })
    .withMessage("Profile picture must be an image file or a valid URL"),
  body("bio").optional().isString().withMessage("Bio must be a string"),
  body("office_location")
    .optional()
    .isString()
    .withMessage("Office location must be a string"),
  body("verification_doc")
    .optional()
    .isURL()
    .withMessage("Invalid URL for verification document"),
  body("interests").notEmpty().withMessage("Interests are required"),
  // body("interests")
  //   .isArray({ min: 1 })
  //   .withMessage("At least one interest is required")
  //   .custom((value) =>
  //     value.every((i) => typeof i === "string" && i.length >= 2)
  //   )
  //   .withMessage("Each interest must be at least 2 characters long"),
  body("social_media").optional(),
  // body("social_media")
  //   .optional()
  //   .isArray()
  //   .withMessage("Social media must be an array")
  //   .custom((value) => value.every((url) => /^https?:\/\/.+\..+/i.test(url)))
  //   .withMessage("Each social media link must be a valid URL"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateTravelAgencyUpdate = [
  body("agency_name")
    .optional()
    .notEmpty()
    .withMessage("Agency name is required"),
  body("agency_type")
    .optional()
    .isIn(["local", "international"])
    .withMessage("Invalid agency type"),
  // Optional fields
  body("profile_picture")
    .optional()
    .isURL()
    .withMessage("Invalid URL for profile picture"),
  body("bio").optional().isString().withMessage("Bio must be a string"),
  body("office_location")
    .optional()
    .isString()
    .withMessage("Office location must be a string"),
  body("verification_doc")
    .optional()
    .isURL()
    .withMessage("Invalid URL for verification document"),
  body("social_media")
    .optional()
    .isArray()
    .withMessage("Social media must be an array"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
