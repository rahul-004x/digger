"use client";

import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useRef, useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

export type TProps = {
  onSubmit: (text: string) => void;
  disabled?: boolean;
  style?: string;
  top: string;
};

function Input({
  onSubmit,
  disabled,
  style,
  top,
}: TProps) {
  const [inputText, setInputText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const alphaKeyRegex = /^[a-zA-Z]$/
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        textareaRef.current?.contains(document.activeElement)
      ) {
        return;
      }

      if (alphaKeyRegex.test(e.key)) {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleSubmit = () => {
    if (inputText.trim()) {
      onSubmit(inputText.trim());
      setInputText("");
    }
  };

  const MAX_HEIGHT = 200;

  const AnimatePlaceholder = () => (
    <AnimatePresence mode="wait">
      <motion.p className="pointer-events-none absolute w-[150px] text-sm text-black/70">
        Search the web...
      </motion.p>
    </AnimatePresence>
  );

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-3xl rounded-[22px] border border-black/5 p-1">
        <div className="relative rounded-2xl border border-black/5 bg-neutral-800/5">
          <div
            className="overflow-y-auto"
            style={{ maxHeight: `${MAX_HEIGHT}px` }}
          >
            <div className="relative">
              <Textarea
                id="ai-input"
                value={inputText}
                ref={textareaRef}
                className="w-full resize-none rounded-2xl rounded-b-none border-none bg-black/5 px-4 py-3 leading-[1.2] focus-visible:ring-0"
                onChange={(e) => {
                  setInputText(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (disabled) return;
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              {!inputText && (
                <div className={cn("absolute left-4", top)}>
                  <AnimatePlaceholder />
                </div>
              )}
            </div>
          </div>
          <div className={style}>
            <div className="absolute right-3 bottom-3">
              <button
                onClick={handleSubmit}
                disabled={disabled}
                className={cn(
                  "rounded-full p-2 transition-colors",
                  disabled
                    ? "cursor-not-allowed bg-black/5 text-black/40 dark:bg-white/5 dark:text-white/40"
                    : inputText.trim()
                      ? "bg-black/95 text-white/90"
                      : "bg-black/5 text-black/40 hover:text-black dark:bg-white/5 dark:text-white/40 dark:hover:text-white",
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Input);
