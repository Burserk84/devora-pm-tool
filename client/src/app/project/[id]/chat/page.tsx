"use client";
import { ChatBox } from "@/components/ChatBox";

export default function ChatPage({ params }: { params: { id: string } }) {
  return <ChatBox projectId={params.id} />;
}
