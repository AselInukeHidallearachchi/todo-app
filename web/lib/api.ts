import axios from "axios";

// Read the public env var. In Next.js this is replaced at build time, but
// it can be undefined during local dev or if not configured.
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseURL) {
  // Helpful runtime hint so you can see the cause in the browser/devtools.
  // This avoids silent failures when `baseURL` is undefined and requests
  // fall back to the current origin.
  // (If you prefer not to log in production, wrap this in a NODE_ENV check.)
  console.warn(
    "NEXT_PUBLIC_API_BASE_URL is not set. Axios requests will use the current origin unless a base URL is provided."
  );
}

const api = axios.create({
  baseURL: baseURL ?? undefined,
  headers: { "Content-Type": "application/json" },
});

export default api;
