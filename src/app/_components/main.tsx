"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { MessageSquare } from "lucide-react";

import InputArea from "./Input";
import Answer from "./answer";
import Sidebar from "./sidebar";
import { UserButton } from "@clerk/nextjs";
import { Loader } from "@/components/ai-elements/loader";
import { ms } from "zod/v4/locales";

type Source = {
  title: string;
  url: string;
};
type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

const Main = () => {
  // --- State Management ---
  const [promptValue, setPromptValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();

  // State to control the streaming query
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [isContextQueryEnabled, setIsContextQueryEnabled] = useState(false);

  // --- tRPC Hooks ---
  const searchParams = useSearchParams();
  const utils = api.useUtils();

  useEffect(() => {
    const convId = searchParams.get("conversationId") ?? undefined;
    setConversationId(convId);
    setMessages([]); // Clear messages when conversation changes
    setIsContextQueryEnabled(false); // Disable query for new conversation
  }, [searchParams]);

  const { data: initialMessages, isLoading: isHistoryLoading } =
    api.db.getMessages.useQuery(
      { conversationId: conversationId! },
      { enabled: !!conversationId && messages.length === 0 }, // Only run if ID exists and messages are not loaded
    );

  useEffect(() => {
    if (initialMessages) {
      const historyMessages = initialMessages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
        sources: (msg.sources as Source[]) || undefined,
      }));
      setMessages(historyMessages);
    }
  }, [initialMessages]);

  const getSourceMutation = api.source.getSource.useMutation({
    onSuccess: async (data) => {
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
        window.history.pushState(
          null,
          "",
          `?conversationId=${data.conversationId}`,
        );
        await utils.db.getConversations.invalidate();
      }
      setSources(data.sources);
      setIsContextQueryEnabled(true); // IMPORTANT: Enable the getContext query now
    },
  });

  const { data: chunks, isFetching: isContextFetching } =
    api.source.getContext.useQuery(
      {
        sources: sources,
        question: currentQuestion,
        conversationId: conversationId!,
      },
      {
        enabled: isContextQueryEnabled,
        refetchOnWindowFocus: false,
        trpc: { abortOnUnmount: true },
      },
    );

  useEffect(() => {
    if (!chunks) return;

    const errorChunk = chunks.find((chunk: any) => chunk.type === "error");

    if (errorChunk) {
      console.error("Streaming Error:", errorChunk.data);
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg?.role === "assistant") {
          return [
            ...prev.slice(0, -1),
            {
              ...lastMsg,
              content: `An error occurred: ${errorChunk.data}`,
            },
          ];
        }
        return prev;
      });
      return;
    }
    const newAnswer = chunks
      .filter((c) => c.type === "answer")
      .map((c) => c.data)
      .join("");

    setMessages((prev) => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg?.role === "assistant") {
        return [
          ...prev.slice(0, -1),
          { ...lastMsg, content: newAnswer },
        ];
      }
      return prev;
    });
  }, [chunks]);

  const handleDisplayResult = useCallback(() => {
    if (promptValue.trim()) {
      const newQuestion = promptValue;

      setIsContextQueryEnabled(false);
      setSources([]);
      setCurrentQuestion(newQuestion);

      setMessages((prev) => [
        ...prev,
        { role: "user", content: newQuestion },
        { role: "assistant", content: "" },
      ]);

      getSourceMutation.mutate({ question: newQuestion, conversationId });
      setPromptValue("");
    }
  }, [promptValue, conversationId, getSourceMutation]);

  const isLoading = getSourceMutation.isPending || isContextFetching;
  const showChatView = messages.length > 0 || isHistoryLoading;

  if (!showChatView && !isHistoryLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="absolute top-3 right-3">
          <UserButton />
        </div>
        <div className="absolute top-3 left-3">
          <Sidebar />
        </div>
        <h1 className="mb-7 text-3xl">digger</h1>
        <div className="w-full max-w-3xl">
          <InputArea
            promptValue={promptValue}
            setPromptValue={setPromptValue}
            handleDisplayResult={handleDisplayResult}
            disabled={isLoading}
            style="h-12 rounded-md bg-black/5"
            top="top-3"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex h-screen w-full flex-col p-4">
      <div className="absolute top-3 right-3">
        <UserButton />
      </div>
      <div className="absolute top-3 left-3">
        <Sidebar />
      </div>
      <div className="flex-grow overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl">
            {isHistoryLoading && messages.length === 0 && <Loader className="flex justify-center items-center h-screen"/>}
          {messages.map((msg, index) => (
            <div key={index} className="mt-4 mb-2 flex flex-col gap-4">
              {msg.role === "user" ? (
                <div className="flex items-center gap-2 rounded-md border bg-black/5 p-3">
                  <MessageSquare size={20} />
                  <span className="font-semibold">{msg.content}</span>
                </div>
              ) : (
                <Answer answer={msg.content} />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0">
        <div className="mx-auto w-full max-w-3xl">
          <InputArea
            promptValue={promptValue}
            setPromptValue={setPromptValue}
            handleDisplayResult={handleDisplayResult}
            disabled={isLoading}
            top="top-5"
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
