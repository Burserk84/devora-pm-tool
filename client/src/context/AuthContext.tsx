"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import apiClient from "@/lib/apiClient";

interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  role: "SUPERADMIN" | "USER";
}

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  login: (data: unknown) => Promise<void>;
  register: (data: unknown) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
      // FIX: Decode the full user object
      const decodedUser: AuthUser = jwtDecode(storedToken);
      setUser(decodedUser);
    }
  }, []);

  const login = async (data: unknown) => {
    try {
      const response = await apiClient.post("/auth/login", data);
      const { token } = response.data;
      setToken(token);
      localStorage.setItem("authToken", token);
      // FIX: Decode the full user object
      const decodedUser: AuthUser = jwtDecode(token);
      setUser(decodedUser);
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  const register = async (data: unknown) => {
    try {
      const response = await apiClient.post("/auth/register", data);
      const { token } = response.data;
      setToken(token);
      localStorage.setItem("authToken", token);
      // FIX: Decode the full user object
      const decodedUser: AuthUser = jwtDecode(token);
      setUser(decodedUser);
      router.push("/");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
