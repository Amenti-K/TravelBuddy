const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  uploadVerification,
  getVerificationStatus,
  reviewVerification,
} = require("../controllers/verification.controller");

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Only JPEG, PNG and JPG are allowed. Received: ${file.mimetype}`
        )
      );
    }
  },
});

// Upload verification images
router.post(
  "/upload",
  upload.fields([
    { name: "primary_image", maxCount: 1 },
    { name: "secondary_image", maxCount: 1 },
  ]),
  (req, res, next) => {
    next();
  },
  uploadVerification
);

// Get verification status
router.get("/status", getVerificationStatus);

// Admin route to review verification
router.post("/review/:id", reviewVerification);

module.exports = router;
