import api from "../utils/api";
import { handleApiError } from "../utils/apiErrorHandler";

// Request to join a trip
export const requestToJoin = async (trip_id) => {
  try {
    const response = await api.put(`/trips/request-to-join/${trip_id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Get all participants of a trip
export const getTripParticipants = async (trip_id) => {
  try {
    const response = await api.get(`/trips/get-participants/${trip_id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Update participant status (approve)
export const updateParticipantStatus = async (trip_id, user_id, status) => {
  try {
    console.log("user_id: ", user_id);
    const response = await api.put(`/trips/update-status/${trip_id}`, {
      user_id,
      status,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Leave trip or cancel request or reject request
export const leaveTrip = async (trip_id) => {
  try {
    const response = await api.delete(`/trips/leave/${trip_id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
