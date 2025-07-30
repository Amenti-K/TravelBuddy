import api from "../utils/api";
import { handleApiError } from "../utils/apiErrorHandler";

export const getChatList = async (user_id) => {
  try {
    const response = await api.get(`/Chat/rooms/${user_id}`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch chat list");
    }
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getChatMessages = async (chatId, beforeDate = null) => {
  try {
    const url = beforeDate
      ? `/Chat/messages/${chatId}?beforeDate=${beforeDate}`
      : `/Chat/messages/${chatId}`;

    const response = await api.get(url);
    console.log("response.data", response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
