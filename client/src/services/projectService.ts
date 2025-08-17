import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5001/api",
});

// We need to manually set the token from localStorage for requests
// that might happen before the AuthContext is fully initialized.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProjects = async () => {
  const response = await apiClient.get("/projects");
  return response.data.data; // The projects are in the 'data' property
};

export const createProject = async (projectData: {
  name: string;
  description?: string;
}) => {
  const response = await apiClient.post("/projects", projectData);
  return response.data.data;
};
