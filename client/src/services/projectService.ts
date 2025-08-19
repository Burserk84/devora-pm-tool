import apiClient from "@/lib/apiClient"; // <-- IMPORT our new client

export const getProjects = async () => {
  const response = await apiClient.get("/projects");
  return response.data.data;
};

// This function was missing from your code, so I've added it here.
export const getProjectById = async (id: string) => {
  const response = await apiClient.get(`/projects/${id}`);
  // Let's assume the response is not nested for a single item for now.
  // We can adjust if needed.
  return response.data.data;
};

export const createProject = async (projectData: {
  name: string;
  description?: string;
}) => {
  const response = await apiClient.post("/projects", projectData);
  return response.data.data;
};

export const createTask = async (taskData: {
  title: string;
  content?: string;
  projectId: string;
}) => {
  const response = await apiClient.post("/tasks", taskData);
  return response.data.data;
};

export const updateTaskStatus = async (taskId: string, status: string) => {
  const response = await apiClient.patch(`/tasks/${taskId}/status`, { status });
  return response.data.data;
};

export const deleteProject = async (id: string) => {
  await apiClient.delete(`/projects/${id}`);
};

export const deleteTask = async (id: string) => {
  await apiClient.delete(`/tasks/${id}`);
};

export const getUsers = async () => {
  const response = await apiClient.get("/users");
  return response.data.data;
};

export const getTaskById = async (taskId: string) => {
  const response = await apiClient.get(`/tasks/${taskId}`);
  return response.data.data;
};

export const updateTask = async (taskId: string, taskData: unknown) => {
  const response = await apiClient.put(`/tasks/${taskId}`, taskData);
  return response.data.data;
};
