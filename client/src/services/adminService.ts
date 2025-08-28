import apiClient from "@/lib/apiClient";

// Define a type for the user data we'll be sending
interface NewUserData {
  name: string;
  email: string;
  password?: string; // Password can be optional if you want to set a default
  title?: string;
}

export const adminCreateUser = async (userData: NewUserData) => {
  const response = await apiClient.post("/admin/users", userData);
  return response.data.data;
};
