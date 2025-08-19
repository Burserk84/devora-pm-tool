import apiClient from "@/lib/apiClient";

export const getCurrentUser = async () => {
  const response = await apiClient.get("/users/me");
  return response.data.data;
};

export const updateUser = async (data: { name?: string; title?: string }) => {
  const response = await apiClient.put("/users/me", data);
  return response.data.data;
};
