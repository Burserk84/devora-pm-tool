import axios from "axios";

const apiClient = axios.create({
  // Use the environment variable for the production URL
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Use an interceptor to add the auth token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
