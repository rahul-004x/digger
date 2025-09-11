import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CitationNumber } from "./CitationNumber";
import WebResultCard from "../WebResultCard";

interface CitationTooltipProps {
  index: number;
  sources: { url: string; title: string };
}
export const CitationTooltip = ({ index, sources }: CitationTooltipProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <CitationNumber num={index + 1} />
      </PopoverTrigger>
      <PopoverContent>
        <WebResultCard result={sources} id={sources.url} />
      </PopoverContent>
    </Popover>
  );
};
