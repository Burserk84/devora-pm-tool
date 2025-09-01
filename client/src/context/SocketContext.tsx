"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
}

// Create the socket instance outside the component
// This ensures it's only created once per application lifecycle
const socketInstance = io("http://localhost:5001", {
  autoConnect: false, // We will connect manually
});

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { token, user } = useAuth();

  useEffect(() => {
    if (token && user) {
      socketInstance.auth = { userId: user.id }; 
      socketInstance.connect();
    } else {
      socketInstance.disconnect();
    }

    return () => {
      socketInstance.disconnect();
    };
  }, [token, user]);

  return (
    <SocketContext.Provider value={{ socket: socketInstance }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
