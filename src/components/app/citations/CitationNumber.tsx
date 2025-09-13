import React from "react";

export const CitationNumber = React.forwardRef<
  HTMLSpanElement,
  { num: number } & React.HTMLAttributes<HTMLSpanElement>
>(({ num, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className="mx-[1px] bg-gray-200 inline-block align-text-bottom text-xs rounded px-1 tabular-nums cursor-pointer hover:bg-gray-300 transition-colors"
      {...props}
    >
      {num}
    </span>
  );
});

CitationNumber.displayName = "CitationNumber";
