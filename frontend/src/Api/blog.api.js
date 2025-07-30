import api, { uploadApi } from "../utils/api";
import { handleApiError } from "../utils/apiErrorHandler";
import { objectToFormData } from "../utils/formDataHelper";

// For blog post with images
export const postBlog = async (newBlog) => {
  try {
    const formData = new FormData();
    Object.keys(newBlog).forEach((key) => {
      objectToFormData(formData, key, newBlog[key]);
    });
    const response = await uploadApi.post("/Blog/create", formData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Paginated blog fetcher
export const fetchPaginatedBlogs = async ({ page = 1, limit = 10 }) => {
  try {
    const response = await api.get(
      `/Blog/get-blogs?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get the comments of a blog
export const fetchBlogComments = async (blogId) => {
  try {
    const response = await api.get(`/Blog/comments/${blogId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// For adding a comment to a blog
export const addCommentToBlog = async (blogId, text) => {
  try {
    const response = await api.post(`/Blog/comments/${blogId}`, { text });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// For toggling like on a blog
export const toggleLikeBlog = async (blogId) => {
  try {
    const response = await api.post(`/Blog/like/${blogId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// For reporting a blog
export const reportBlog = async (blogId, reason) => {
  try {
    const response = await api.post(`/Blog/report/${blogId}`, { reason });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
