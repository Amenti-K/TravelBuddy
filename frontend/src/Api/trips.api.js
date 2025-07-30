import api, { uploadApi } from "../utils/api";
import { handleApiError } from "../utils/apiErrorHandler";
import { objectToFormData } from "../utils/formDataHelper";

// Create a new trip
export const createTrip = async (tripDetails) => {
  try {
    console.log("td: ", tripDetails);
    const formData = new FormData();
    Object.keys(tripDetails).forEach((key) => {
      objectToFormData(formData, key, tripDetails[key]);
    });
    const response = await uploadApi.post("/Trips/create", formData, {
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload Progress: ${percent}%`);
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating trip:", error);
    throw error;
  }
};

// Get a specific trip by ID
export const getTrip = async (trip_id) => {
  try {
    const response = await api.get(`/trips/get-one/${trip_id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Get trips created by a user
export const getMyCreatedTrips = async ({ pageParam }) => {
  try {
    const response = await api.get(`/trips/get-created`, {
      params: { page: pageParam },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Discover and filter trips
export const getDiscoverAndFilter = async ({
  pageParam,
  queryFilters = {},
}) => {
  try {
    const response = await api.get("/trips/discover", {
      params: {
        ...queryFilters,
        page: pageParam,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Update a trip
export const updateTrip = async (tripId, tripDetails) => {
  try {
    const hasNewFiles = tripDetails.trip_pictures?.some(
      (pic) => pic instanceof File
    );

    if (hasNewFiles) {
      const formData = new FormData();
      Object.keys(tripDetails).forEach((key) => {
        objectToFormData(formData, key, tripDetails[key]);
      });

      const response = await uploadApi.put(`/trips/update/${tripId}`, formData);
      return response.data;
    } else {
      const response = await api.put(`/trips/update/${tripId}`, tripDetails);
      return response.data;
    }
  } catch (error) {
    console.error("Error updating trip:", error);
    throw error;
  }
};

// Delete a trip
export const deleteTrip = async (trip_id) => {
  try {
    const response = await api.delete(`/trips/delete/${trip_id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
