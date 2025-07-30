"use client";

import { useState } from "react";
import InputArea from "./InputArea";
import { api } from "@/trpc/react";

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

  const { mutate: GetSources } = mutation;

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
    <div className="mx-auto flex h-screen w-full max-w-7xl">
      <div className="flex w-full flex-col justify-between p-4">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <h1 className="text-lg">{promptValue}</h1>
            {promptValue && (
              <div className="my-2 w-full border-b-2 border-gray-300" />
            )}
            <div className="mt-4">
              {sources.map((source, index) => (
                <div key={index} className="mb-2 rounded-md border p-2">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {source.name}
                  </a>
                </div>
              ))}
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
