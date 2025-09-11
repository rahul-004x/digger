const WebResultCard = ({
  result,
  id,
}: {
  result: { url: string; title: string };
  id: string;
}) => {
  return (
    <a
      key={id}
      href={result.url}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="flex justify-start items-center w-full overflow-hidden"
    >
      <div>{result.url}</div>
    </a>
  );
};

export default WebResultCard;
