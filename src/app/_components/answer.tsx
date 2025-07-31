const Answer = ({ answer }: { answer: string }) => {
  return (
    <div className="py-1.2 flex h-full w-full rounded-lg border border-solid border-[#C1C1C1] p-5 px-3">
      {answer}
    </div>
  );
};

export default Answer;
