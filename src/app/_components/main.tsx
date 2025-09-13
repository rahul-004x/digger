"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { MessageSquare, ChevronDown } from "lucide-react";

import InputArea from "./Input";
import Answer from "./answer";
import Sidebar from "./sidebar";
import { UserButton } from "@clerk/nextjs";
import { Loader } from "@/components/ai-elements/loader";
import {
  Sources,
  SourcesContent,
  SourcesTrigger,
  Source as SourceComponent,
} from "@/components/ai-elements/source";

type Source = {
  title: string;
  url: string;
};

type chunk = {
  data: string;
  type: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

const Main = () => {
  const [promptValue, setPromptValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();

  // Auto-scroll refs and state
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  // State to control the streaming query
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [isContextQueryEnabled, setIsContextQueryEnabled] = useState(false);

  // Auto-scroll functions
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  const isAtBottom = () => {
    const container = containerRef.current;
    if (!container) return true;
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  // Auto-scroll when messages change
  useEffect(() => {
    if (messages.length > 0 && !userScrolledUp) scrollToBottom();
  }, [messages, userScrolledUp]);

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

    const errorChunk = chunks.find((chunk: chunk) => chunk.type === "error");

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
              sources: sources.length > 0 ? sources : lastMsg.sources,
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
          {
            ...lastMsg,
            content: newAnswer,
            // Attach sources when streaming is complete
            sources: sources.length > 0 ? sources : lastMsg.sources,
          },
        ];
      }
      return prev;
    });

    // Auto-scroll during streaming
    if (chunks.some((c) => c.type === "answer") && !userScrolledUp) {
      setTimeout(scrollToBottom, 50);
    }
  }, [chunks, userScrolledUp, sources]); // Added sources to dependency array

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

      // Reset scroll state and scroll to new message
      setUserScrolledUp(false);
      setTimeout(scrollToBottom, 100);
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
      <div
        className="flex-grow overflow-y-auto"
        ref={containerRef}
        onScroll={() => setUserScrolledUp(!isAtBottom())}
      >
        <div className="mx-auto w-full max-w-3xl">
          {isHistoryLoading && messages.length === 0 && (
            <Loader className="flex h-screen items-center justify-center" />
          )}
          {messages.map((msg, index) => (
            <div key={index} className="mt-2 mb-4 flex flex-col gap-4">
              {msg.role === "user" ? (
                <div className="flex items-center gap-1 rounded-md border bg-black/5 p-2">
                  <MessageSquare size={20} />
                  <span className="font-semibold">{msg.content}</span>
                </div>
              ) : (
                <div className="flex flex-col">
                  {msg.sources && msg.sources.length > 0 && (
                    <Sources>
                      <SourcesTrigger />{" "}
                      <SourcesContent>
                        {msg.sources.map((source, sourceIndex) => (
                          <SourceComponent
                            key={sourceIndex}
                            title={source.title}
                            href={source.url}
                          />
                        ))}
                      </SourcesContent>
                    </Sources>
                  )}
                  <Answer answer={msg.content} sources={msg.sources} />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {userScrolledUp && (
          <button
            onClick={() => {
              setUserScrolledUp(false);
              scrollToBottom();
            }}
            className="fixed cursor-pointer right-210 bottom-30 z-10 rounded-full border border-gray-200 bg-white p-2 shadow-lg hover:bg-gray-50"
          >
            <ChevronDown size={20} className="text-gray-600" />
          </button>
        )}
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
