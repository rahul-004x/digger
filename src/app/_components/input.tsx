'use client'

import { useState } from "react";

const Input = () => {
  const [question, setQuestion] = useState("");
  return (
    <div>
      <form>
        <input
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
