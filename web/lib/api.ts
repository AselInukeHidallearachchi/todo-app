import { TaskStatsResponse } from "@/types/api";
import axios from "axios";

// Types for API responses
export interface TaskStats {
  total: number;
  completed: number;
  in_progress: number;
  pending: number;
}

// Resolve a sensible API base URL (works even if env var wasn't present at build time)
const resolvedHost = (() => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL)
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "");
  if (typeof window !== "undefined") {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port =
      window.location.port === "3000" ? "8000" : window.location.port || "8000";
    return `${protocol}//${hostname}:${port}`;
  }
  return "http://localhost:8000";
})();

const api = axios.create({
  baseURL: resolvedHost,
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
export const uploadTaskAttachment = async (
  taskId: number,
  file: File
): Promise<any> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file, file.name);

  const response = await api.post(`/tasks/${taskId}/attachments`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  // Backend returns: { success, message, data: Attachment }
  return response.data?.data || response.data;
};

// Delete attachment helper function
export const deleteTaskAttachment = async (
  taskId: number,
  attachmentId: number
) => {
  await api.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
};

// Fetch task statistics for the logged-in user
export const fetchTaskStatistics = async (): Promise<TaskStats> => {
  const response = await api.get<TaskStatsResponse>("/tasks-statistics");
  return response.data.data;
};

// Small typed helpers for consistent API usage across the app.
export const get = async <T = unknown>(url: string) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
  const response = await api.get<T>(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return response.data as T;
};

export const post = async <T = unknown, B = unknown>(url: string, body?: B) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
  const response = await api.post<T>(url, body, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return response.data as T;
};

export default api;
/**
 * Create task with attachments in a single request
 * Returns created task with all attachments
 */
export const createTaskWithAttachments = async (
  taskData: {
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
  },
  files: File[]
): Promise<Task> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  // Add task data
  formData.append("title", taskData.title);
  formData.append("description", taskData.description);
  formData.append("status", taskData.status);
  formData.append("priority", taskData.priority);
  formData.append("due_date", taskData.due_date);

  // Add files
  files.forEach((file) => {
    formData.append("attachments[]", file);
  });

  const response = await api.post("/tasks/create-with-attachments", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  // Backend returns: { success: true, data: Task }
  return response.data?.data || response.data;
};
