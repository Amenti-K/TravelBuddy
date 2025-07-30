const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("./cloudinaryConfig");

// Configure Multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (!file.mimetype.startsWith("image/")) {
      throw new Error("Invalid file type! Only images are allowed.");
    }

    return {
      folder: "travel_buddy",
      allowed_formats: ["jpg", "jpeg", "png"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
      format: file.mimetype.split("/")[1] || "jpg",
      public_id: `${Date.now()}-${(file.originalname || "").split(".")[0]}`,
    };
  },
});

// Multer configuration to accept both images and text fields
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(
        new Error("Invalid file type! Only JPG, JPEG, and PNG are allowed."),
        false
      );
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
});

module.exports = upload;
