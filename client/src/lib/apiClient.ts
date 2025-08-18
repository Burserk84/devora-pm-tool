import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5001/api",
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
