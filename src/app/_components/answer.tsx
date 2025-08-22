import ReactMarkdown from "react-markdown";
import { Streamdown } from "streamdown";

const Answer = ({ answer }: { answer: string }) => {
  return (
    <div className="py-1.2 flex h-full w-full rounded-lg border border-solid border-[#C1C1C1] p-5 px-3">
      <div className="flex-1 text-base leading-[152.5%] font-light text-black">
        {answer ? (
          <Streamdown>{answer}</Streamdown>
        ) : (
          <div className="flex w-full flex-col gap-2">
            <div className="h-6 w-full animate-pulse rounded-md bg-gray-300"></div>
            <div className="h-6 w-full animate-pulse rounded-md bg-gray-300"></div>
            <div className="h-6 w-full animate-pulse rounded-md bg-gray-300"></div>
            <div className="h-6 w-full animate-pulse rounded-md bg-gray-300"></div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Answer;
