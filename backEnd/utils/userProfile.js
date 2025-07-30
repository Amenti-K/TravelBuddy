const AuthInfo = require("../models/AuthInfo");
const SoloTraveler = require("../models/SoloTraveler.model");
const TravelAgency = require("../models/TravelAgency.model");

exports.getMinimalUserProfile = async (authUser) => {
  if (authUser.user_type === "solo_traveler") {
    return await SoloTraveler.getMinimalProfile(authUser._id);
  } else if (authUser.user_type === "agency") {
    return await TravelAgency.getMinimalProfile(authUser._id);
  }
};

exports.findAndMinimal = async (id) => {
  const User = await AuthInfo.findById(id);
  return await exports.getMinimalUserProfile(User);
};

exports.composeMinimalAuthProfile = async function (authUser) {
  const profile = await exports.getMinimalUserProfile(authUser);
  const isSolo = authUser.user_type === "solo_traveler";

  return {
    user_id: isSolo ? profile?.user_id || authUser._id : null,
    agency_id: !isSolo ? profile?.agency_id || authUser._id : null,
    email: authUser.email,
    full_name: profile?.full_name || profile?.agency_name || null,
    profile_picture: profile?.profile_picture || null,
    trust_score: profile?.trust_score || 40,
    user_type: authUser.user_type,
  };
};

exports.findAndCompose = async (id) => {
  const User = await AuthInfo.findById(id);
  return await exports.composeMinimalAuthProfile(User);
};
