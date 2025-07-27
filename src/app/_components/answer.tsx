import { type Source } from "./input";
interface AnswerProps {
  question: string;
  source: Source[];
}

const Answer = ({ question, source }: AnswerProps) => {
  return (
    <div>
      <p>
        <strong>Question:</strong> {question}
      </p>
    </div>
  );
};

export default Answer;
