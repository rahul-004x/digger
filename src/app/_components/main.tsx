"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageAvatar } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { PromptInput, PromptInputTextarea, PromptInputSubmit } from "@/components/ai-elements/prompt-input";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Source = {
  name: string;
  url: string;
};

const Main = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [promptValue, setPromptValue] = useState("");
  const [submittedPromptValue, setSubmittedPromptValue] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isContextQueryEnabled, setIsContextQueryEnabled] = useState(false);

  // Get sources mutation
  const mutation = api.source.getSource.useMutation({
    onSuccess: (data) => {
      setSources(data);
      setIsContextQueryEnabled(true);
    },
  });

  const { mutate: GetSources } = mutation;

  // Get context query for streaming responses
  const { data: chunks, isFetching } = api.source.getContext.useQuery(
    { urls: sources.map((s) => s.url), question: submittedPromptValue },
    {
      enabled: isContextQueryEnabled && sources.length > 0 && submittedPromptValue !== "",
      trpc: { abortOnUnmount: false }, // keeps sse open
    },
  );

  // Process streaming chunks
  useEffect(() => {
    if (!chunks) return;

    const errorChunk = chunks.find((chunk) => chunk.type === "error");
    if (errorChunk) {
      // Handle error - could set an error message in the last assistant message
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
      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: promptValue.trim(),
      };

      // Add empty assistant message that will be populated by streaming
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      
      // Set up for API calls
      setSubmittedPromptValue(promptValue.trim());
      GetSources({ question: promptValue.trim() });
      
      // Clear input
      setPromptValue("");
      
      // Set conversation ID if this is the first message
      if (!conversationId) {
        setConversationId(`conv-${Date.now()}`);
      }
    }
  }, [promptValue, conversationId, GetSources]);

  return (
    <div className="flex h-screen w-full flex-col">
      <Conversation className="flex-1 overflow-y-auto">
        <ConversationContent>
          <div className="mx-auto max-w-4xl space-y-4">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <h1 className="mb-4 text-3xl font-bold">digger</h1>
                  <p className="text-gray-500">Start a conversation by typing a message below</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageAvatar
                    src=""
                    name={message.role === "user" ? "User" : "Assistant"}
                  />
                  <MessageContent>
                    {message.role === "assistant" && message.content === "" ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.1s" }}></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    ) : message.role === "assistant" ? (
                      <Response>{message.content}</Response>
                    ) : (
                      <div>{message.content}</div>
                    )}
                  </MessageContent>
                </Message>
              ))
            )}
          </div>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      
      <div className="border-t bg-background p-4">
        <div className="mx-auto max-w-4xl">
          <PromptInput
            onSubmit={(e) => {
              e.preventDefault();
              handleDisplayResult();
            }}
          >
            <PromptInputTextarea
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              placeholder="What would you like to know?"
              disabled={isFetching}
            />
            <div className="flex justify-end p-2">
              <PromptInputSubmit
                status={isFetching ? "streaming" : undefined}
                disabled={!promptValue.trim() || isFetching}
              />
            </div>
          </PromptInput>
        </div>
      </div>
    </div>
  );
};

export default Main;