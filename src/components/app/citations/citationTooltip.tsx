import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CitationNumber } from "./CitationNumber";
import WebResultCard from "../WebResultCard";

interface CitationTooltipProps {
  index: number;
  sources: { url: string; title: string };
}
export const CitationTooltip = ({ index, sources }: CitationTooltipProps) => {
  return (
      <Tooltip>
        <TooltipTrigger asChild>
          <CitationNumber num={index + 1} />
        </TooltipTrigger>
        <TooltipContent>
          <WebResultCard result={sources} id={sources.url} />
        </TooltipContent>
      </Tooltip>
  );
};
