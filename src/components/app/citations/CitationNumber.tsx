export const CitationNumber = ({ num }: { num: number }) => {
  return <span className="mx-[1px] bg-gray-200 inline-block align-text-bottom text-xs rounded px-1 tabular-nums cursor-pointer">
    {num}
  </span>;
};
