import { getDomainFromUrl } from "@/lib/utils";
import { FaviconImage } from "./FaviconImage";
import Image from "next/image";

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
      className="flex justify-start items-center w-full overflow-hidden gap-3 px-4 py-3 rounded-lg bg-gray-50 border-[0.7px] border-gray-200"
    >
      <div className="flex flex-col justify-start items-start gap-1 relative overflow-hidden">
        <div className="flex flex-row gap-2">
          <p className="max-w-full truncate text-xs text-left text-[#4a5565]">{result.title}</p>
        </div>
        <div className="flex items-start justify-start gap-1 relative">
          <div className="flex items-center justify-start gap-1.5 relative">
            <div className="relative w-3.5 h-3.5 rounded bg-gray-100">
              <FaviconImage url={result.url} className="size-2.5 absolute left-px top-px object-none"/>
            </div>
            <p className="text-xs font-light text-left text-[#99a1af]">
              {getDomainFromUrl(result.url)}
            </p>
            <div className="p-2">
              <Image src="/link.svg" alt="link" width={16} height={16} className="size-4"/>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default WebResultCard;
