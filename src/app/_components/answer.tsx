import { Response } from "@/components/ai-elements/response";

const Answer = ({ answer }: { answer: string }) => {
  return (
    <div className="py-1.2 order flex h-full w-full max-w-3xl items-center justify-center rounded-lg p-5 px-3">
      <div className="flex-1 text-base leading-[152.5%] font-light text-black">
        {answer ? (
          <Response>{answer}</Response>
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
