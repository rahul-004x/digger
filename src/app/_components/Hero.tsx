"use client";

import { useState } from "react";
import InputArea from "./InputArea";

const Hero = () => {
  const [promptValue, setPromptValue] = useState("");

  const handleDisplayResult = () => {
    ///
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl mb-7">
          digger
        </h1>
        <div className="mb-50">
          <InputArea
            promptValue={promptValue}
            setPromptValue={setPromptValue}
            handleDisplayResult={handleDisplayResult}
          />
        </div>
      </div>
    </>
  );
};

export default Hero;
