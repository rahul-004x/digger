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
      className="flex w-full items-center justify-start gap-3 overflow-hidden rounded-lg border-[0.7px] border-gray-200 bg-gray-50 px-4 py-3"
    >
      <div className="relative flex flex-col items-start justify-start gap-1 overflow-hidden">
        <div className="flex flex-row gap-2">
          <p className="max-w-full truncate text-left text-xs text-[#4a5565]">
            {result.title}
          </p>
        </div>
        <div className="relative flex items-start justify-start gap-1">
          <div className="relative flex items-center justify-start gap-1.5">
            <div className="relative h-3.5 w-3.5 rounded bg-gray-100">
              <FaviconImage
                url={result.url}
                className="absolute top-px left-px size-2.5 object-none"
              />
            </div>
            <p className="text-left text-xs font-light text-[#99a1af]">
              {getDomainFromUrl(result.url)}
            </p>
            <div className="p-2">
              <Image
                src="/link.svg"
                alt="link"
                width={16}
                height={16}
                className="size-4"
              />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default WebResultCard;
