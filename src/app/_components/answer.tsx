const Answer = ({ answer }: { answer: string }) => {
  return (
    <div className="py-1.2 flex h-full w-full rounded-lg border border-solid border-[#C1C1C1] p-5 px-3">
      <div className="text-base font-light text-black leading-[152.5%]">
        {answer ? (
          answer.trim()
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
