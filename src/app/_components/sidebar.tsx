
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";

type Conversation = {
  id: string;
  name: string | null;
  clerkUserId: string | null;
  createdAt: Date;
};

const Sidebar = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentConversationId = searchParams.get("conversationId");

  const { data: conversationsData, isLoading } =
    api.db.getConversations.useQuery();

  useEffect(() => {
    if (conversationsData) {
      setConversations(conversationsData);
    }
  }, [conversationsData]);

  const handleNewChat = () => {
    router.push("/");
  };

  const handleSelectConversation = (conversationId: string) => {
    router.push(`/?conversationId=${conversationId}`);
  };

  return (
    <div className="w-64 flex flex-col bg-[#F5F6FA] h-screen p-4 rounded-md">
      {/* Header */}
      <h2 className="text-xl font-bold mb-4 ml-18">Digger</h2>

      {/* New Chat button */}
      <button
        className="px-4 py-2 w-full bg-black text-white rounded-md hover:bg-gray-800 mb-4"
        onClick={handleNewChat}
      >
        New Chat
      </button>

      {/* Recent conversations */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Recent Conversations
        </h3>

        <div className="flex-1 space-y-1 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex w-full flex-col gap-1">
              <div className="h-4 w-full rounded bg-gray-300 animate-pulse"></div>
              <div className="h-4 w-full rounded bg-gray-300 animate-pulse"></div>
              <div className="h-4 w-full rounded bg-gray-300 animate-pulse"></div>
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-sm text-gray-500">No conversations yet</p>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className={cn(
                  "p-2 text-sm hover:bg-gray-200 cursor-pointer rounded-md truncate",
                  currentConversationId === conversation.id ? "bg-gray-200" : ""
                )}
                title={conversation.name ?? "Untitled Conversation"} // tooltip for long names
              >
                {conversation.name ?? "Untitled Conversation"}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
