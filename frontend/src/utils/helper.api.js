/**
 * Converts an object to FormData
 * @param {Object} data - The object to convert
 * @returns {FormData} The converted FormData object
 */
export const convertToFormData = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  return formData;
};

/**
 * Handles API errors and returns a formatted error message
 * @param {Error} error - The error object
 * @returns {string} Formatted error message
 */
export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

/**
 * Formats date to YYYY-MM-DD format
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Validates file size
 * @param {File} file - The file to validate
 * @param {number} maxSize - Maximum size in bytes
 * @returns {boolean} Whether the file size is valid
 */
export const validateFileSize = (file, maxSize = 5 * 1024 * 1024) => {
  return file.size <= maxSize;
};

/**
 * Validates file type
 * @param {File} file - The file to validate
 * @param {string[]} allowedTypes - Array of allowed MIME types
 * @returns {boolean} Whether the file type is valid
 */
export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']) => {
  return allowedTypes.includes(file.type);
}; 