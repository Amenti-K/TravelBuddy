import * as Yup from "yup";
const imageUrlRegex = /^https?:\/\/.*\.(jpg|jpeg|png|gif|bmp|webp)$/i;

// 1. Frontend validation for the profile form (Step 1)
export const profileValidationSchema = Yup.object({
  first_name: Yup.string()
    .min(3, "First name must be at least 3 characters long")
    .required("First name is required"),
  last_name: Yup.string()
    .min(3, "Last name must be at least 3 characters long")
    .required("Last name is required"),
  date_of_birth: Yup.date()
    .required("Date of birth is required")
    .typeError("Invalid date format"),
  gender: Yup.string()
    .oneOf(["male", "female"], "Gender must be either male or female")
    .required("Gender is required"),
  location: Yup.string().required("Location is required"),
  bio: Yup.string().max(255, "Bio must be less than 255 characters"),
  social_media: Yup.array().of(Yup.string().url("Invalid URL format")),

  profile_picture: Yup.array()
    .max(1, "Only one profile picture is allowed")
    .of(
      Yup.mixed()
        .nullable()
        .test("fileType", "Only image files are allowed", (value) => {
          if (!value) return true;
          if (value instanceof File) return value.type.startsWith("image/");
          if (typeof value === "string") return imageUrlRegex.test(value);
          return false;
        })
    ),
});

// 2. API Validation (before sending to the backend)
export const apiProfileValidationSchema = Yup.object({
  user_id: Yup.string().required("User ID is required"),

  full_name: Yup.string()
    .required("Full name is required")
    .min(6, "Full name must be at least 6 characters long"),

  gender: Yup.string()
    .oneOf(["male", "female"], "Invalid gender")
    .required("Gender is required"),

  date_of_birth: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .required("Date of birth is required"),

  location: Yup.string().required("Location is required"),

  interests: Yup.array()
    .of(Yup.string().min(2, "Each interest must be at least 2 characters"))
    .min(1, "At least one interest is required"),

  social_media: Yup.array()
    .of(
      Yup.string()
        .url("Must be a valid URL")
        .matches(/^https?:\/\/.+\..+/i, "Must be a valid URL")
    )
    .nullable(),

  bio: Yup.string().max(255, "Bio must be less than 255 characters").nullable(),

  profile_picture: Yup.string()
    .nullable()
    .test("fileType", "Only image files or a URL are allowed", (value) => {
      if (!value) return true;
      return value instanceof File || typeof value === "string";
    }),
});

// 3. Full Profile Schema (used for updates, backend validation)
export const fullProfileValidationSchema = apiProfileValidationSchema.shape({
  verification_doc: Yup.mixed().test(
    "fileType",
    "Only image files are allowed",
    (value) => {
      return value instanceof File || typeof value === "string";
    }
  ),
});
