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
    <div className="max-w-3xl mx-auto">
      {/* <div className="mb-10"> */}
      {/*   {sources.length > 0 && ( */}
      {/*     <div> */}
      {/*       <p>Sources</p> */}
      {/*       <ul> */}
      {/*         {sources.map((source) => ( */}
      {/*           <li key={source.name}> */}
      {/*             <a href={source.url}>{source.name}</a> */}
      {/*           </li> */}
      {/*         ))} */}
      {/*       </ul> */}
      {/*     </div> */}
      {/*   )} */}
      {/* </div> */}
      <form
        onSubmit={handleSubmit}
        className="min-w-2xl rounded-lg border-gray-600 p-4"
      >
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What you want to dig..."
            className="w-full resize-none rounded-xl border-1 py-3 pr-12 pl-3 pb-6 focus:outline-none"
            disabled={isPending}
            rows={3}
          />
          <button
            type="submit"
            className="absolute right-3 bottom-2 rounded-lg bg-gray-400 p-2 text-white hover:bg-gray-600 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Input;
