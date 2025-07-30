import api from "../utils/api";
import { handleApiError } from "../utils/apiErrorHandler";

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/sign-in", { email, password });
    console.log("response from try: ", response);
    return response.data;
  } catch (error) {
    console.log("error from catch: ", error);
    if (error.response?.data) {
      return error.response.data;
    }
    handleApiError(error);
    return { success: false, message: "Unexpected error occurred." };
  }
};

export const sendOtp = async (
  email,
  phoneNumber,
  password,
  confirmPassword,
  userType
) => {
  try {
    const response = await api.post("/auth/send-otp", {
      email,
      phone_number: phoneNumber,
      password,
      confirmPassword,
      user_type: userType,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      return error.response.data;
    }
    handleApiError(error);
    return { success: false, message: "Unexpected error occurred." };
  }
};

export const verifyOtp = async (
  otp,
  email,
  phoneNumber,
  password,
  userType
) => {
  try {
    const response = await api.post("/auth/verify-create", {
      otp,
      email,
      phone_number: phoneNumber,
      password,
      user_type: userType,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      return error.response.data;
    }
    handleApiError(error);
    return { success: false, message: "Unexpected error occurred." };
  }
};
