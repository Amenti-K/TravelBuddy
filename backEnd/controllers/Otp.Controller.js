const OTP = require("../models/OTP");
const { sendOTPEmail } = require("../utils/emailService");
const AuthInfo = require("../models/AuthInfo");

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP for email verification
exports.sendOTP = async (req, res) => {
  try {
    const { email, phone_number } = req.body;
    // Check if email is already in use
    const credentialCheck = await AuthInfo.isCredentialsInUse(
      email,
      phone_number
    );
    if (!credentialCheck.success) {
      return res.status(400).json(credentialCheck);
    }
    // Delete existing OTPs for this email
    await OTP.deleteMany({ email });
    // Generate new OTP
    const otp = generateOTP();
    // Save OTP to database
    await OTP.create({ email, otp });
    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to send OTP email" });
    }
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in sendOTP:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Find OTP record
    const otpDoc = await OTP.findOne({ email, otp });
    if (!otpDoc) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // Delete OTP after verification
    await OTP.deleteOne({ _id: otpDoc._id });

    // Attach the verified email to req for the next middleware
    req.verifiedEmail = email;

    // Proceed to the next middleware (createAuthInfo)
    next();
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
