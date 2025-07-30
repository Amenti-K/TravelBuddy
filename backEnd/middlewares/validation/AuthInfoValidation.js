const { check, validationResult } = require("express-validator");

// Validation for AuthInfo SignUp
exports.validateAuthInfoSignUp = [
  check("email").trim().isEmail().withMessage("Invalid email!"),

  check("phone_number")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Phone number is required!")
    .isMobilePhone()
    .withMessage("Invalid phone number format!"),

  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 to 20 characters!"),

  check("confirmPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Confirm password is required!")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match!");
      }
      return true;
    }),

  check("user_type")
    .trim()
    .not()
    .isEmpty()
    .withMessage("User type is required!")
    .isIn(["solo_traveler", "agency"])
    .withMessage("Invalid user type!"),

  check("is_verified")
    .optional()
    .isBoolean()
    .withMessage("is_verified must be a boolean value!"),
];

// Validation for AuthInfo SignIn
exports.validateAuthInfoSignIn = [
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Invalid email format!"),

  check("password").trim().not().isEmpty().withMessage("Password is required!"),
];

// Middleware to handle validation results
exports.authInfoValidation = (req, res, next) => {
  const errors = validationResult(req).array();
  if (!errors.length) return next();

  res.status(400).json({ success: false, message: errors[0].msg });
};
