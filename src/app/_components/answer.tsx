export type Source = {
  name: string;
  url: string;
};

interface AnswerProps {
  question: string;
  sources: Source[];
}

const Answer = ({ question, sources }: AnswerProps) => {
  return (
    <div className="flex flex-col">
      <h1 className="flex items-start text-lg">{question}</h1>
      {question && (
        <div className="mb-4 w-full max-w-2xl border-b-2 border-gray-300"></div>
      )}
      {sources.map((source, index) => (
        <div key={index} className="mb-2 rounded-md border p-2">
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {source.name}
          </a>
        </div>
      ))}
    </div>
  );
};

export default Answer;
