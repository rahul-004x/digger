"use client";

import { useCallback, useEffect, useState } from "react";
import InputArea from "./Input";
import { api } from "@/trpc/react";
import Source from "./Source";
import Answer from "./answer";
import { MessageSquare } from "lucide-react";

type Source = {
  name: string;
  url: string;
};

const Hero = () => {
  const [promptValue, setPromptValue] = useState("");
  const [submittedPromptValue, setSubmittedPromptValue] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [answer, setAnswer] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const mutation = api.source.getSource.useMutation({
    onSuccess: (data) => {
      setSources(data);
    },
  });

  const { mutate: GetSources, isPending } = mutation;

  const { data: chunks, isFetching } = api.source.getContext.useQuery(
    { urls: sources.map((s) => s.url), question: submittedPromptValue },
    {
      enabled: sources.length > 0 && submittedPromptValue !== "", //only runs when source urls exists
      trpc: { abortOnUnmount: false }, // keeps sse open
    },
  );

  useEffect(() => {
    if (!chunks) return;

    const errorChunk = chunks.find((chunk) => chunk.type === "error");
    if (errorChunk) {
      setError(errorChunk.data as string);
      setAnswer(""); // Clear answer on error
      return; // Stop processing
    }
    setError(null); // No error found, clear any previous error.

    const ans = chunks
      .filter((c) => c.type === "answer")
      .map((c) => c.data)
      .join("");
    setAnswer(ans);
  }, [chunks]);

  const handleDisplayResult = useCallback(() => {
    if (promptValue.trim()) {
      setSubmittedPromptValue(promptValue);
      GetSources({ question: promptValue });
      setShowResult(true);
      setPromptValue("");
    }
  }, [promptValue, GetSources]);

  if (!showResult) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="mb-7 text-3xl">digger</h1>
        <div className="w-full max-w-3xl">
          <InputArea
            promptValue={promptValue}
            setPromptValue={setPromptValue}
            handleDisplayResult={handleDisplayResult}
            disabled={isFetching}
            style="h-12 rounded-md bg-black/5"
            top="top-3"
          />
        </div>
      </div>
    );
  }

  return (
  <div className="container mx-auto flex h-screen w-full flex-col p-4">
    <div className="flex-grow overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mt-4 mb-2 flex flex-col gap-4">
          <div className="flex items-center gap-2 bg-black/5 border rounded-md p-3">
            <MessageSquare size={20} />
            <span className="font-semibold">{submittedPromptValue}</span>
          </div>
          {error && (
            <div className="rounded-md border border-red-400 bg-red-100 p-4 text-red-500">
              {error}
            </div>
          )}
          <Answer answer={answer} />
        </div>
      </div>
    </div>
    <div className="flex-shrink-0">
      <div className="mx-auto w-full max-w-3xl">
        <InputArea
          promptValue={promptValue}
          setPromptValue={setPromptValue}
          handleDisplayResult={handleDisplayResult}
          disabled={isFetching}
          top="top-5"
        />
      </div>
    </div>
  </div>
  );
};

export default Hero;

