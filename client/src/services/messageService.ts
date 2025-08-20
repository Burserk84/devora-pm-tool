import apiClient from "@/lib/apiClient";

export const getMessagesForProject = async (projectId: string) => {
  const response = await apiClient.get(`/projects/${projectId}/messages`);
  return response.data.data;
};
