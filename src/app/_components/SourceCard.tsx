import Image from "next/image";
const SourceCard = ({ source }: { source: { name: string; url: string } }) => {
  return (
    <div>
      <div>
        <Image
          src={`https://www.google.com/s2/favicons?domain=${source.url}&sz=128`}
          alt="logo"
          className="p-1"
          height={44}
          width={44}
        />
      </div>
      <div>
        <h6>{source.name}</h6>
        <a href={source.url} target="_blank" rel="noopener norefferer">
          {source.url}
        </a>
      </div>
    </div>
  );
};

export default SourceCard;
