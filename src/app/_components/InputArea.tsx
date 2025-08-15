"use client";
import React, { useState } from "react";

export type TInputProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
  handleDisplayResult: () => void;
};

const InputArea: React.FC<TInputProps> = ({
  promptValue,
  setPromptValue,
  handleDisplayResult,
  disabled,
}) => {
  return (
    <>
      <div className="mx-auto max-w-3xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDisplayResult();
          }}
          className="min-w-2xl rounded-lg border-gray-600 p-4"
        >
          <div className="relative">
            <textarea
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              placeholder="What you want to dig..."
              className="w-full resize-none rounded-xl border-1 py-3 pr-12 pb-6 pl-3 focus:outline-none"
              disabled={disabled}
              rows={3}
              autoFocus
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
    </>
  );
};

export default React.memo(InputArea);
