const multer = require("multer");
const upload = require("../config/multerConfig");

const allUploadFields = [
  { name: "profile_picture", maxCount: 1 },
  { name: "verification_doc", maxCount: 2 },
  { name: "blog_pictures", maxCount: 3 },
  { name: "trip_pictures", maxCount: 5 },
];

const conditionalUpload = (req, res, next) => {
  if (req.headers["content-type"]?.startsWith("multipart/form-data")) {
    const uploadFields = upload.fields(allUploadFields);

    uploadFields(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: `Multer error: ${err.message}`,
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: `File upload error: ${err.message}`,
        });
      }
      next();
    });
  } else {
    next();
  }
};

module.exports = conditionalUpload;

// const logRequestDetails = (req, res, next) => {
//   console.log("---- Incoming Request ----");
//   console.log("Method:", req.method);
//   console.log("URL:", req.originalUrl);
//   console.log("Content-Type:", req.headers["content-type"]);
//   if (
//     req.headers["content-type"] &&
//     req.headers["content-type"].includes("multipart")
//   ) {
//     console.log("Request is multipart/form-data");
//     console.log("Form fields:", req.body);
//     if (req.files) {
//       console.log("Files:");
//       if (Array.isArray(req.files)) {
//         req.files.forEach((file) => {
//           console.log(
//             `  - ${file.fieldname}: ${file.originalname} (${file.mimetype})`
//           );
//         });
//       }
//     }
//   } else {
//     console.log("Request is NOT multipart/form-data");
//   }
//   console.log("Body:", req.body);
//   console.log("----------  ---------------");
//   next();
// };
