const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AuthInfoSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    user_type: {
      type: String,
      enum: ["solo_traveler", "agency"],
      required: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    tokens: [
      {
        token: String,
        signedAt: String,
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
AuthInfoSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Compare Password
AuthInfoSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Check if email exists
AuthInfoSchema.statics.isCredentialsInUse = async function (
  email,
  phone_number
) {
  const emailExists = await this.findOne({ email });
  if (emailExists) {
    return { success: false, message: "Email is already in use" };
  }
  const phoneNumberExists = await this.findOne({ phone_number });
  if (phoneNumberExists) {
    return { success: false, message: "Phone number is already in use" };
  }
  return { success: true };
};

// Check if user exists
AuthInfoSchema.statics.userExists = async function (_id) {
  return await this.findOne({ _id });
};

const AuthInfo = mongoose.model("AuthInfo", AuthInfoSchema);
module.exports = AuthInfo;
