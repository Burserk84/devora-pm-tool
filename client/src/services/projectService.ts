import apiClient from "@/lib/apiClient";

export const getProjects = async () => {
  const response = await apiClient.get("/projects");
  return response.data.data;
};

// Now accepts an optional filters object
export const getProjectById = async (
  id: string,
  filters: { search?: string; assigneeId?: string } = {}
) => {
  const params = new URLSearchParams();
  if (filters.search) {
    params.append("search", filters.search);
  }
  if (filters.assigneeId) {
    params.append("assigneeId", filters.assigneeId);
  }

  const response = await apiClient.get(`/projects/${id}?${params.toString()}`);
  return response.data.data;
};

export const createProject = async (projectData: {
  name: string;
  description?: string;
}) => {
  const response = await apiClient.post("/projects", projectData);
  return response.data.data;
};

// FIX: Changed 'content' to 'description'
export const createTask = async (taskData: {
  title: string;
  description?: string;
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

export const inviteUserToProject = async (projectId: string, email: string) => {
  const response = await apiClient.post(`/projects/${projectId}/members`, {
    email,
  });
  return response.data.data;
};

export const updateMemberRole = async (
  projectId: string,
  memberId: string,
  role: "ADMIN" | "MEMBER"
) => {
  const response = await apiClient.patch(
    `/projects/${projectId}/members/${memberId}`,
    { role }
  );
  return response.data.data;
};
