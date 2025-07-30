import api, { uploadApi } from "../utils/api";
import { handleApiError } from "../utils/apiErrorHandler";
import { objectToFormData } from "../utils/formDataHelper";

export const createTravelAgencyProfile = async (agencyProfile) => {
  try {
    const formData = new FormData();
    Object.keys(agencyProfile).forEach((key) => {
      objectToFormData(formData, key, agencyProfile[key]);
    });
    const response = await uploadApi.post(
      "/TravelAgency/create-profile",
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
    return handleApiError(error);
  }
};

export const getTravelAgencyProfile = async (user_id) => {
  try {
    const response = await api.get(`/TravelAgency/get-profile/${user_id}`);
    console.log("agency profile: ", response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateTravelAgencyProfile = async (user_id, profile) => {
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
        `/TravelAgency/update-profile/${user_id}`,
        profile
      );
      return response.data;
    } else {
      const response = await api.put(
        `/TravelAgency/update-profile/${user_id}`,
        profile
      );
      return response.data;
    }
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteTravelAgencyProfile = async (user_id) => {
  try {
    const response = await api.delete(
      `/TravelAgency/delete-profile/${user_id}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
