"use client";

import { useEffect, useState } from "react";
import InputArea from "./InputArea";
import { api } from "@/trpc/react";
import Source from "./Source";
import Answer from "./answer";

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
    const ans = chunks
      .filter((c) => c.type === "answer")
      .map((c) => c.data)
      .join("");
    setAnswer(ans);
  }, [chunks]);

  // const { mutate: GetContext } = api.source.getContext.useQuery({
  //   onSuccess: (data) => {
  //     if (data) {
  //       const combinedContext = data.context.map((c) => c.context).join("\n\n");
  //       setContext(combinedContext);
  //       setAnswer(data.aiAnswer ?? "");
  //     }
  //   },
  // });

  const handleDisplayResult = () => {
    if (promptValue.trim()) {
      GetSources({ question: promptValue });
      setShowResult(true);
    }
  };

  if (!showResult) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="mb-7 text-3xl">digger</h1>
        <div className="w-full max-w-3xl">
          <InputArea
            promptValue={promptValue}
            setPromptValue={setPromptValue}
            handleDisplayResult={handleDisplayResult}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex h-screen w-full">
      <div className="flex w-full flex-col justify-between p-4">
        <div className="flex flex-col justify-center">
          <div className="w-full max-w-4xl">
            <div className="mt-4 mb-2 flex flex-col gap-4">
              <Source sources={sources} isLoading={isPending} />
              <Answer answer={answer} />
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <InputArea
            promptValue={promptValue}
            setPromptValue={setPromptValue}
            handleDisplayResult={handleDisplayResult}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
