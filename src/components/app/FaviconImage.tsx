import { getDomainFromUrl } from "@/lib/utils";

export const FaviconImage: React.FC<{
  url: string;
  className?: string;
  children?: React.ReactNode;
}> = ({ url, className = "", children }) => (
  <img
    src={`https://www.google.com/s2/favicons?domain=${getDomainFromUrl(url)}`}
    alt="favicon"
    className="size-3.5 rounded-full mr-1"
    style={{ display: "inline-block", verticalAlign: "middle" }}
  />
);
