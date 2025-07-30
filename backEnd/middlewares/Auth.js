const jwt = require("jsonwebtoken");
const AuthInfo = require("../models/AuthInfo");

exports.isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await AuthInfo.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access. User not found.",
          code: "USER_NOT_FOUND",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token. Unauthorized access.",
          code: "INVALID_TOKEN",
        });
      }

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Session expired. Please sign in again.",
          code: "TOKEN_EXPIRED",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        code: "INTERNAL_ERROR",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Authorization header missing.",
      code: "NO_AUTH_HEADER",
    });
  }
};
