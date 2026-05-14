const rawBaseUrl = import.meta.env.VITE_BACKEND_URL || "";
const apiBaseUrl = rawBaseUrl.replace(/\/+$/, "");

if (!apiBaseUrl) {
  console.warn("VITE_BACKEND_URL is not set. API requests may fail.");
}

export { apiBaseUrl };
