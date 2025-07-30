export const handleApiError = (error) => {
  if (error.response) {
    console.log("error: ", error.response.data);
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return { type: "validation", message: data?.message || "Bad request" };
      case 401:
        return { type: "auth", message: "Unauthorized, please log in" };
      case 404:
        return { type: "not_found", message: "Requested resource not found" };
      case 500:
        return { type: "server", message: "Internal server error" };
      default:
        return {
          type: "unknown",
          message: data?.message || "Something went wrong",
        };
    }
  } else {
    return {
      type: "network",
      message: "Network error, check your internet connection",
    };
  }
};
