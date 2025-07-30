import * as Yup from "yup";
const imageUrlRegex = /^https?:\/\/.*\.(jpg|jpeg|png|gif|bmp|webp)$/i;

export const tripValidationSchema = Yup.object({
  trip_name: Yup.string().required("Trip name is required"),
  trip_description: Yup.string().nullable(),
  departure_date: Yup.date()
    .required("Departure date is required")
    .typeError("Invalid date format"),
  returning_date: Yup.date()
    .required("Returning date is required")
    .min(
      Yup.ref("departure_date"),
      "Returning date must be after departure date"
    )
    .typeError("Invalid date format"),
  flexible_dates: Yup.boolean().default(false),
  starting_location: Yup.string().required("Starting location is required"),
  destination: Yup.string().required("Destination is required"),
  path: Yup.array().of(Yup.string().required("Path entries must be strings")),
  max_participants: Yup.number()
    .nullable()
    .min(1, "Max participants must be at least 1"),
  trip_status: Yup.string()
    .oneOf(["coming soon", "ongoing", "completed"], "Invalid trip status")
    .required("Trip status is required"),

  trip_pictures: Yup.array()
    .max(5, "Maximum of 5 trip pictures allowed")
    .of(
      Yup.mixed()
        .nullable()
        .test(
          "isValidTripImage",
          "Trip picture must be an image file or a valid URL",
          (value) => {
            if (!value) return true;
            if (value instanceof File) return value.type.startsWith("image/");
            if (typeof value === "string") return imageUrlRegex.test(value);
            return false;
          }
        )
    )
    .nullable(),

  category: Yup.array(),
  // .of(
  //   Yup.string().oneOf(
  //     ["adventure", "beach", "historical", "nature", "luxury", "budget"],
  //     "Invalid category"
  //   )
  // )
  // .nullable(),

  activities: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().nullable(),
        description: Yup.string().nullable(),
        location: Yup.string().nullable(),
        date: Yup.date().nullable().typeError("Invalid activity date"),
        time: Yup.string().nullable(),
        optional: Yup.boolean().nullable(),
      })
    )
    .nullable(),

  transportation: Yup.array()
    .of(
      Yup.object({
        type: Yup.string()
          .oneOf(
            ["flight", "train", "bus", "car rental", "other"],
            "Invalid transportation type"
          )
          .nullable(),
        provider: Yup.string().nullable(),
        details: Yup.string().nullable(),
        departure_time: Yup.date()
          .nullable()
          .typeError("Invalid departure time"),
        arrival_time: Yup.date().nullable().typeError("Invalid arrival time"),
      })
    )
    .nullable(),

  expenses: Yup.object({
    estimated_per_person: Yup.number()
      .min(0, "Must be a positive number")
      .nullable(),
    breakdown: Yup.object({
      transportation: Yup.number()
        .min(0, "Must be a positive number")
        .nullable(),
      accommodation: Yup.number()
        .min(0, "Must be a positive number")
        .nullable(),
      meals: Yup.number().min(0, "Must be a positive number").nullable(),
      activities: Yup.number().min(0, "Must be a positive number").nullable(),
      miscellaneous: Yup.number()
        .min(0, "Must be a positive number")
        .nullable(),
    }).nullable(),
  }).nullable(),

  fee: Yup.object({
    agency_fee: Yup.number().min(0, "Must be a positive number").nullable(),
    includes: Yup.array().of(Yup.string()).nullable(),
  }).nullable(),

  packing_list: Yup.array()
    .of(
      Yup.object({
        item: Yup.string().nullable(),
        category: Yup.string()
          .oneOf(
            [
              "clothing",
              "toiletries",
              "documents",
              "electronics",
              "miscellaneous",
            ],
            "Invalid category"
          )
          .nullable(),
      })
    )
    .nullable(),

  required_documents: Yup.array()
    .of(
      Yup.object({
        document_name: Yup.string().nullable(),
        required_for_entry: Yup.boolean().nullable(),
        required_for_trip: Yup.boolean().nullable(),
      })
    )
    .nullable(),
});

// Validation scheme for search and filtering
export const tripFilterSchema = Yup.object().shape({
  destination: Yup.string(),
  departure_date: Yup.date().nullable(),
  returning_date: Yup.date()
    .nullable()
    .min(Yup.ref("departure_date"), "Returning date must be after departure"),
  trip_status: Yup.string().oneOf(["coming soon", "ongoing", "completed"]),
  category: Yup.array().of(
    Yup.string().oneOf([
      "adventure",
      "roadtrip",
      "extreme",
      "snow",
      "luxury",
      "wildlife",
      "camping",
      "beach",
      "relaxation",
      "cultural",
    ])
  ),
  flexible_dates: Yup.boolean(),
  max_participants: Yup.number().min(1, "At least 1 participant"),
  transportation: Yup.array().of(
    Yup.string().oneOf(["flight", "train", "bus", "car rental", "other"])
  ),
});
