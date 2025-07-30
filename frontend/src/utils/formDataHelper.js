export const objectToFormData = (formData, key, data) => {
  if (data instanceof File || data instanceof Blob) {
    formData.append(key, data);
  } else if (Array.isArray(data)) {
    if (data.length > 0 && data[0] instanceof File) {
      data.forEach((file) => {
        formData.append(key, file);
      });
    } else {
      data.forEach((value, index) => {
        if (
          typeof value === "object" &&
          value !== null &&
          !(value instanceof File || value instanceof Blob)
        ) {
          objectToFormData(formData, `${key}[${index}]`, value);
        } else {
          formData.append(`${key}[${index}]`, value);
        }
      });
    }
  } else if (typeof data === "object" && data !== null) {
    Object.keys(data).forEach((subKey) => {
      objectToFormData(formData, `${key}[${subKey}]`, data[subKey]);
    });
  } else {
    formData.append(key, data);
  }
};
