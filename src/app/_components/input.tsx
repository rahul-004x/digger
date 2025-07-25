"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

const Input = () => {
  const [question, setQuestion] = useState("");

  const { mutate } = api.source.getSource.useMutation({
    onSuccess: async () => {
      setQuestion("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ question });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What you want to dig..."
          className="border-2"
        />
      </form>
    </div>
  );
};

export default Input;
