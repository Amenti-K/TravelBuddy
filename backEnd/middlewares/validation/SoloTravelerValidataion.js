const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

exports.validateSoloTravelerProfile = [
  body("user_id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid user ID"),

  body("full_name")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 6 })
    .withMessage("Full name must be at least 6 characters long"),

  body("gender").isIn(["male", "female"]).withMessage("Invalid gender"),

  body("date_of_birth")
    .isISO8601()
    .withMessage("Invalid date format (Expected YYYY-MM-DD)"),

  body("location").notEmpty().withMessage("Location is required"),

  body("interests").notEmpty().withMessage("Interests are required"),
  // body("interests")
  //   .isArray({ min: 1 })
  //   .withMessage("At least one interest is required")
  //   .custom((value) =>
  //     value.every((i) => typeof i === "string" && i.length >= 2)
  //   )
  //   .withMessage("Each interest must be at least 2 characters long"),

  body("profile_picture")
    .optional()
    .custom((value, { req }) => {
      if (!req.file && typeof value !== "string") {
        return false; // Must be a file or a URL
      }
      return true;
    })
    .withMessage("Profile picture must be an image file or a valid URL"),

  body("bio")
    .optional()
    .isString()
    .withMessage("Bio must be a string")
    .isLength({ max: 255 })
    .withMessage("Bio must be less than 255 characters"),

  body("social_media").optional(),
  // body("social_media")
  //   .optional()
  //   .isArray()
  //   .withMessage("Social media must be an array")
  //   .custom((value) => value.every((url) => /^https?:\/\/.+\..+/i.test(url)))
  //   .withMessage("Each social media link must be a valid URL"),

  body("verification_doc")
    .optional()
    .custom((value, { req }) => {
      if (!req.file && typeof value !== "string") {
        return false;
      }
      return true;
    })
    .withMessage("Verification document must be an image file or a valid URL"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateSoloTravelerUpdate = [
  body("full_name")
    .optional()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 6 })
    .withMessage("Full name must be at least 6 characters long"),

  body("gender")
    .optional()
    .isIn(["male", "female"])
    .withMessage("Invalid gender"),

  body("date_of_birth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),

  body("location").optional().notEmpty().withMessage("Location is required"),

  body("interests")
    .optional()
    .isArray()
    .withMessage("Interests must be an array")
    .custom((value) =>
      value.every((i) => typeof i === "string" && i.length >= 2)
    )
    .withMessage("Each interest must be at least 2 characters long"),

  body("profile_picture")
    .optional()
    .custom((value, { req }) => {
      if (!req.file && typeof value !== "string") {
        return false;
      }
      return true;
    })
    .withMessage("Profile picture must be an image file or a valid URL"),

  body("bio")
    .optional()
    .isString()
    .withMessage("Bio must be a string")
    .isLength({ max: 255 })
    .withMessage("Bio must be less than 255 characters"),

  body("social_media")
    .optional()
    .isArray()
    .withMessage("Social media must be an array")
    .custom((value) => value.every((url) => /^https?:\/\/.+\..+/i.test(url)))
    .withMessage("Each social media link must be a valid URL"),

  body("verification_doc")
    .optional()
    .custom((value, { req }) => {
      if (!req.file && typeof value !== "string") {
        return false;
      }
      return true;
    })
    .withMessage("Verification document must be an image file or a valid URL"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
