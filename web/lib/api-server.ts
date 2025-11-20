import { getAuthToken } from "./auth";

// Get the API base URL
const getApiBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    "http://localhost:8000"
  );
};

/**
 * Server-side API client for making authenticated requests
 * This should only be used in Server Components and Server Actions
 */
export async function apiServer<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  const url = `${getApiBaseUrl()}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    cache: options.cache !== undefined ? options.cache : "force-cache", // Cache by default for performance
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Convenience methods for different HTTP verbs
 */
export const serverApi = {
  get: <T = unknown>(endpoint: string, options?: RequestInit) =>
    apiServer<T>(endpoint, { ...options, method: "GET" }),

  post: <T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ) =>
    apiServer<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T = unknown>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiServer<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: <T = unknown>(endpoint: string, options?: RequestInit) =>
    apiServer<T>(endpoint, { ...options, method: "DELETE" }),
};
