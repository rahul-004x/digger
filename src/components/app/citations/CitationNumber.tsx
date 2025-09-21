import React from "react";

export const CitationNumber = React.forwardRef<
  HTMLSpanElement,
  { num: number } & React.HTMLAttributes<HTMLSpanElement>
>(({ num, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className="mx-[1px] inline-block cursor-pointer rounded bg-gray-200 px-1 align-text-bottom text-xs tabular-nums transition-colors hover:bg-gray-300"
      {...props}
    >
      {num}
    </span>
  );
});

CitationNumber.displayName = "CitationNumber";
