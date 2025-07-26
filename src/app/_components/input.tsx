"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

interface Source {
  name: string;
  url: string;
}

const Input = () => {
  const [question, setQuestion] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [answers, setAnswers] = useState<Array<{ answer: string }>>([]);

  const { mutate: getAnswerMutate } = api.source.getAnswer.useMutation({
    onSuccess: (data) => {
      setAnswers(data);
    },
  });

  const { mutate: getSourceMutate, isPending } =
    api.source.getSource.useMutation({
      onSuccess: async (data) => {
        setQuestion("");
        setSources(data);
        const urls = data.map((item) => item.url);
        getAnswerMutate({ urls });
        console.log(answers);
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getSourceMutate({ question });
  };

  return (
    <div>
      <div className="mb-10">
        {sources.length > 0 && (
          <div>
            <p>Sources</p>
            <ul>
              {sources.map((source) => (
                <li key={source.name}>
                  <a href={source.url}>{source.name}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What you want to dig..."
            className="w-full rounded-lg border-2 py-3 pr-12 pl-3 focus:outline-none"
            disabled={isPending}
          />
          <button
            type="submit"
            className="ronded-r-lg absolute inset-y-0 right-0 flex w-12 -translate-x-[1px] items-center justify-center bg-gray-300 text-gray-400 hover:text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-right h-5 w-5"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Input;
