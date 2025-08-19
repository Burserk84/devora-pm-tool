import apiClient from "@/lib/apiClient";

export const getNotifications = async () => {
  const response = await apiClient.get("/notifications");
  return response.data.data;
};

export const markAllAsRead = async () => {
  await apiClient.post("/notifications/read");
};
