import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});

// Add request interceptor to add Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// File upload helper function
export const uploadTaskAttachment = async (taskId: number, file: File) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file, file.name);

  const response = await api.post(`/tasks/${taskId}/attachments`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
      // Don't set Content-Type - let axios/browser set it automatically for FormData
    },
  });

  return response.data;
};

// Delete attachment helper function
export const deleteTaskAttachment = async (
  taskId: number,
  attachmentId: number
) => {
  const token = localStorage.getItem("token");
  await api.delete(`/tasks/${taskId}/attachments/${attachmentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default api;
