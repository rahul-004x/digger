"use client";

import { useState } from "react";
import InputArea from "./InputArea";
import { api } from "@/trpc/react";
import Source from "./Source";

type Source = {
  name: string;
  url: string;
};

const Hero = () => {
  const [promptValue, setPromptValue] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [showResult, setShowResult] = useState(false);

  const mutation = api.source.getSource.useMutation({
    onSuccess: (data) => {
      setSources(data);
    },
  });

  const { mutate: GetSources, isPending } = mutation;

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
    <div className="mx-auto flex h-screen w-full">
      <div className="flex w-full flex-col justify-between p-4">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="mt-4">
              <Source sources={sources} isLoading={isPending} />
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
