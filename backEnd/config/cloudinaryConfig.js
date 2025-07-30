const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to delete an image from Cloudinary
const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    // Extract public ID (remove Cloudinary URL parts)
    const parts = imageUrl.split("/");
    const publicId = parts.slice(-2).join("/").split(".")[0]; // Removes file extension too

    await cloudinary.uploader.destroy(publicId);
    console.log("Image deleted from Cloudinary");
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

module.exports = { cloudinary, deleteImage };
