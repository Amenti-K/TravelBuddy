import api, { uploadApi } from "../utils/api";

export const uploadVerificationImages = async (formData) => {
  try {
    // Log the FormData contents before sending
    console.log("Sending FormData to backend:");
    for (let pair of formData.entries()) {
      console.log(
        pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1])
      );
    }

    const response = await api.post("/verification/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // Important for FormData
      transformRequest: [(data) => data],
    });
    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error.response?.data || error.message;
  }
};

export const getVerificationStatus = async () => {
  try {
    const response = await api.get("/verification/status");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
