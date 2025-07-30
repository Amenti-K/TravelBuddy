import api from "../utils/api";
import { handleApiError } from "../utils/apiErrorHandler";

export const getAirports = async (query) => {
  if (!query) return [];
  try {
    const response = await api.get("/Flight/getAirports", {
      params: { q: query },
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch airports");
    }
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getFlights = async (queries) => {
  try {
    console.log("sends.", queries);
    const response = await api.get("/Flight/getFlights", {
      params: {
        ...queries,
      },
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch flights");
    }
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getReturningFlights = async (queries) => {
  try {
    const response = await api.get("/Flight/getReturningFlights", {
      params: {
        ...queries,
      },
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch flights");
    }
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getSelectedFlights = async (queries) => {
  try {
    console.log("sends.", queries);
    const response = await api.get("/Flight/selectedFlights", {
      params: {
        ...queries,
      },
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch flights");
    }
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const saveSelectedFlights = async ({ tripId, searchParameters }) => {
  try {
    console.log("send trip id: ", tripId);
    console.log("searchParameters: ", searchParameters);
    const response = await api.post("/Flight/saveSelectedFlights", {
      tripId,
      searchParameters,
    });
    if (response.status == 400) {
      return { error: "tripId and selectedFlights are required." };
    }
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
