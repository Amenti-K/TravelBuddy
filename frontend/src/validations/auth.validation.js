import * as Yup from "yup";

// Base validation for email and password
const baseAuthValidation = {
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
};

// Full validation for signup form
export const signupValidationSchema = Yup.object({
  ...baseAuthValidation,
  phoneNumber: Yup.string()
    .matches(/^\+?[\d\s-]{10,}$/, "Invalid phone number format")
    .required("Phone number is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("Confirm password is required"),
});

// Simpler validation for login form
export const loginValidationSchema = Yup.object({
  ...baseAuthValidation,
});

// Combined schema with conditional validation
export const authValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  phoneNumber: Yup.string().when("$isSignUp", {
    is: true,
    then: () =>
      Yup.string()
        .matches(/^\+?[\d\s-]{10,}$/, "Invalid phone number format")
        .required("Phone number is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  confirmPassword: Yup.string().when("$isSignUp", {
    is: true,
    then: () =>
      Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords do not match")
        .required("Confirm password is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
});
