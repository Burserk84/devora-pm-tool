"use client";

import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import { getMessagesForProject } from "@/services/messageService";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
  };
}

export function ChatBox({ projectId }: { projectId: string }) {
  const { socket } = useSocket();
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Effect for fetching history and setting up listeners
  useEffect(() => {
    if (!socket || !projectId) return;

    // 1. Fetch chat history
    getMessagesForProject(projectId).then(setMessages);

    // 2. Join the project's chat room
    socket.emit("joinProject", projectId);

    // 3. Listen for incoming messages
    const handleReceiveMessage = (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    socket.on("receiveMessage", handleReceiveMessage);

    // 4. Clean up listeners on unmount
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, projectId]);

  // Effect for auto-scrolling to the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket && currentUser) {
      socket.emit("sendMessage", {
        projectId,
        content: newMessage,
        userId: currentUser.id,
      });
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-slate-800 rounded-lg">
      {/* Message Display Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-3 ${
              msg.user.id === currentUser?.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-lg ${
                msg.user.id === currentUser?.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-700"
              }`}
            >
              <p className="text-xs font-bold mb-1">{msg.user.name}</p>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <div className="p-4 border-t border-slate-700">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}
