"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

type Conversation = {
  id: string;
  name: string | null;
  clerkUserId: string | null;
  createdAt: Date;
};

const Sidebar = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const router = useRouter();
  
  const { data: conversationsData, isLoading } = api.db.getConversations.useQuery();
  
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
    <div className="w-64 p-4 rounded-md bg-gray-50 h-full">
      <h2 className="text-xl font-bold mb-4 ml-19">Digger</h2>
      <button 
        className="px-4 py-2 w-full bg-black text-white rounded-md hover:bg-gray-800 mb-4"
        onClick={handleNewChat}
      >
        New Chat
      </button>
      
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Conversations</h3>
        <div className="space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto">
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
                className="p-2 text-sm hover:bg-gray-200 cursor-pointer rounded-md truncate"
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
