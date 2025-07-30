import api, { uploadApi } from "../utils/api";
import { handleApiError } from "../utils/apiErrorHandler";
import { objectToFormData } from "../utils/formDataHelper";

export const createSoloTravelerProfile = async (profileData) => {
  try {
    const formData = new FormData();
    Object.keys(profileData).forEach((key) => {
      objectToFormData(formData, key, profileData[key]);
    });
    const response = await uploadApi.post(
      "/SoloTraveler/create-profile",
      formData,
      {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percent}%`);
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Profile creation error:", error.response?.data || error);
    throw error;
  }
};

export const getSoloTravelerProfile = async (user_id) => {
  try {
    const response = await api.get(`/SoloTraveler/${user_id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateSoloTravelerProfile = async (user_id, profile) => {
  try {
    const isFile =
      profile.profile_picture &&
      typeof profile.profile_picture === "object" &&
      profile.profile_picture instanceof File;

    if (isFile) {
      const formData = new FormData();
      Object.keys(profile).forEach((key) => {
        objectToFormData(formData, key, profile[key]);
      });

      const response = await uploadApi.put(
        `/SoloTraveler/update-profile/${user_id}`,
        profile
      );
      return response.data;
    } else {
      const response = await api.put(
        `/SoloTraveler/update-profile/${user_id}`,
        profile
      );
      return response.data;
    }
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteSoloTravelerProfile = async (user_id) => {
  try {
    const response = await api.delete(`/SoloTraveler/${user_id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
