const express = require("express");
const router = express.Router();
const { isAuth } = require("../middlewares/Auth");
const {
  validateAuthInfoSignUp,
  validateAuthInfoSignIn,
  authInfoValidation,
} = require("../middlewares/validation/AuthInfoValidation");
const {
  createAuthInfo,
  userSignIn,
  signOut,
} = require("../controllers/AuthInfo.Controller");
const otpController = require("../controllers/Otp.Controller");

// Auth routes for sign-up
router.post(
  "/send-otp",
  validateAuthInfoSignUp,
  authInfoValidation,
  otpController.sendOTP
);
router.post("/verify-create", otpController.verifyOTP, createAuthInfo);

// Auth routes for sign-in
router.post("/sign-in", validateAuthInfoSignIn, authInfoValidation, userSignIn);

// Auth routes for sign-out
router.post("/sign-out", isAuth, signOut);

module.exports = router;
