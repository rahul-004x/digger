const Answer = ({ answer }: { answer: string }) => {
  return (
    <div className="w-full h-full py-1.2 flex border border-solid px-3 p-5">
      {answer}
    </div>
  );
};

export default Answer;
