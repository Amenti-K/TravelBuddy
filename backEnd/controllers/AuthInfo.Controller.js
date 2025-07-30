const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AuthInfo = require("../models/AuthInfo");
const SoloTraveler = require("../models/SoloTraveler.model");
const TravelAgency = require("../models/TravelAgency.model");
const {
  getMinimalUserProfile,
  composeMinimalAuthProfile,
} = require("../utils/userProfile");

// Create new user (Signup)
exports.createAuthInfo = async (req, res) => {
  try {
    const email = req.verifiedEmail;
    const { phone_number, password, user_type, is_verified } = req.body;
    const credentialCheck = await AuthInfo.isCredentialsInUse(
      email,
      phone_number
    );
    if (!credentialCheck.success) {
      return res.status(400).json(credentialCheck);
    }

    const newUser = new AuthInfo({
      email,
      phone_number,
      password,
      user_type,
      is_verified,
    });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    newUser.tokens.push({
      token,
      signedAt: Date.now().toString(),
    });

    await newUser.save();
    const minimalProfile = await composeMinimalAuthProfile(newUser);

    res.status(200).json({
      success: true,
      token,
      user_profile: minimalProfile,
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "OTP verification failed",
    });
  }
};

// Sign In
exports.userSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AuthInfo.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with the given email!",
      });
    }

    // Compare password
    if (!(await user.comparePassword(password))) {
      return res
        .status(400)
        .json({ success: false, message: "Email / password does not match!" });
    }
    const userHaveProfile =
      (await SoloTraveler.userExists(user._id)) ||
      (await TravelAgency.agencyExists(user._id));

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Manage old tokens
    user.tokens = user.tokens.filter(
      (t) => (Date.now() - parseInt(t.signedAt)) / 1000 < 86400
    );
    user.tokens.push({ token, signedAt: Date.now().toString() });
    await user.save();

    res.json({
      success: true,
      haveProfile: userHaveProfile,
      token,
      user_profile: await composeMinimalAuthProfile(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Sign Out
exports.signOut = async (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization required!" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const user = await AuthInfo.findById(req.AuthInfo._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    user.tokens = user.tokens.filter((t) => t.token !== token);
    await user.save();
    res.json({ success: true, message: "Sign out successful!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
