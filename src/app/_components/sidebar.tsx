"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { X } from "lucide-react";

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

  const isMobile = useIsMobile();

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
    <div className="flex h-screen w-64 flex-col rounded-md bg-[#F5F6FA] p-4">
      <div className="flex items-center justify-between">
        <h2 className="mb-4 text-xl font-bold">Digger</h2>
        {isMobile && <X size={23} />}
      </div>
      <button
        className="mb-4 w-full cursor-pointer rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
        onClick={handleNewChat}
      >
        New Chat
      </button>

      {/* Recent conversations */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <h3 className="mb-2 text-sm font-medium text-gray-500">
          Recent Conversations
        </h3>

        <div className="flex-1 space-y-1 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex w-full flex-col gap-1">
              <div className="h-4 w-full animate-pulse rounded bg-gray-300"></div>
              <div className="h-4 w-full animate-pulse rounded bg-gray-300"></div>
              <div className="h-4 w-full animate-pulse rounded bg-gray-300"></div>
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-sm text-gray-500">No conversations yet</p>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className={cn(
                  "cursor-pointer truncate rounded-md p-2 text-sm hover:bg-gray-200",
                  currentConversationId === conversation.id
                    ? "bg-gray-300"
                    : "",
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
