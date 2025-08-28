"use client";
import { ChatBox } from "@/components/ChatBox";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const params = useParams();
  const projectId = params.id as string;

  return <ChatBox projectId={projectId} />;
}
