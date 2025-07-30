import * as Yup from "yup";
const imageUrlRegex = /^https?:\/\/.*\.(jpg|jpeg|png|gif|bmp|webp)$/i;

export const agencyProfileValidationSchema = Yup.object().shape({
  agency_name: Yup.string()
    .min(3, "Agency name must be at least 3 characters long")
    .required("Agency name is required"),
  agency_type: Yup.string()
    .oneOf(["local", "international"], "Invalid agency type")
    .required("Agency type is required"),
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
  bio: Yup.string().max(255, "Bio must be less than 255 characters"),
  office_location: Yup.string().required("Office location is required"),
  social_media: Yup.array().of(Yup.string().url("Invalid URL")),
});

// This schema is for validating the data before sending to the backend API
export const apiAgencyProfileValidationSchema = Yup.object().shape({
  agency_id: Yup.string().required("Agency ID is required"),
  agency_name: Yup.string()
    .min(3, "Agency name must be at least 3 characters long")
    .required("Agency name is required"),
  agency_type: Yup.string()
    .oneOf(["local", "international"], "Invalid agency type")
    .required("Agency type is required"),
  profile_picture: Yup.string()
    .nullable()
    .test("fileType", "Only image files or a URL are allowed", (value) => {
      if (!value) return true;
      return value instanceof File || typeof value === "string";
    }),
  bio: Yup.string()
    .max(255, "Bio must be less than 255 characters")
    .notRequired(),
  office_location: Yup.string().required("Office location is required"),
  verification_doc: Yup.string()
    .url("Invalid URL for verification document")
    .nullable()
    .notRequired(),
  social_media: Yup.array()
    .of(Yup.string().url("Invalid social media URL"))
    .notRequired(),
});
