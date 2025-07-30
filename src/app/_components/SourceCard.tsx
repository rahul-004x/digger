import Image from "next/image";
const SourceCard = ({ source }: { source: { name: string; url: string } }) => {
  return (
    <div className="flex h-[79px] w-full items-center gap-2.5 rounded border border-solid border-[#C1C1C1] bg-neutral-50 px-1.5 py-1 md:w-auto">
      <div>
        <Image
          unoptimized
          src={`https://www.google.com/s2/favicons?domain=${source.url}&sz=128`}
          alt="logo"
          className="p-1"
          height={44}
          width={44}
        />
      </div>
      <div className="flex flex-col justify-center gap-[7px] max-w-[192px] overflow-hidden">
        <h6 className="line-clamp-2 text-sm font-light text-[#1B1B16]">
          {source.name}
        </h6>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-xs font-light text-[#1B1B16]/30"
        >
          {source.url}
        </a>
      </div>
    </div>
  );
};

export default SourceCard;
