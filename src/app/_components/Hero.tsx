"use client";

import { useCallback, useEffect, useState } from "react";
import InputArea from "./Input";
import { api } from "@/trpc/react";
import Source from "./Source";
import Answer from "./answer";
import Input from "./.ui/input";
import { MessageSquare } from "lucide-react";

type Source = {
  name: string;
  url: string;
};

const Hero = () => {
  const [promptValue, setPromptValue] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [context, setContext] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

  const mutation = api.source.getSource.useMutation({
    onSuccess: (data) => {
      setSources(data);
      if (data.length > 0) {
        const urls = data.map((source) => source.url);
        void api.useUtils().source.getContext.invalidate({ urls });
      }
    },
  });

  const { mutate: GetSources, isPending } = mutation;

  const { data: chunks, isFetching } = api.source.getContext.useQuery(
    { urls: sources.map((s) => s.url) },
    {
      enabled: sources.length > 0, //only runs when source urls exists
      trpc: { abortOnUnmount: false }, // keeps sse open
    },
  );

  useEffect(() => {
    if (!chunks) return;
    const context = chunks
      .filter((c) => c.type === "context")
      .map((c) => c.data)
      .join("");
    setContext(context);

    const ans = chunks
      .filter((c) => c.type === "answer")
      .map((c) => c.data)
      .join("");
    setAnswer(ans);
  }, [chunks]);

  const handleDisplayResult = useCallback(() => {
    if (promptValue.trim()) {
      GetSources({ question: promptValue });
      setShowResult(true);
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
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex h-screen w-full">
      <div className="flex w-full flex-col justify-between p-4">
        <div className="flex flex-col justify-center">
          <div className="mx-auto w-full max-w-4xl">
            <div className="mt-4 mb-2 flex flex-col gap-4">
              <Source sources={sources} isLoading={isPending} />
              <Answer answer={answer} />
            </div>
          </div>
        </div>
        <div className="flex justify-center shadow-lg backdrop:blur-md">
          <InputArea
            promptValue={promptValue}
            setPromptValue={setPromptValue}
            handleDisplayResult={handleDisplayResult}
            disabled={isFetching}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
