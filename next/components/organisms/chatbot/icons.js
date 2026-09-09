// Chatbot icon set, standardized on lucide-react. This is a thin shim: it
// re-exports lucide glyphs under the chatbot's historical `…Icon` names, each
// rendered through a Chakra `Box as={…}` so it keeps the Chakra style-prop
// surface the call sites use (width/height, color, boxSize, position, margin, …)
// and defaults to lucide's stroke look at the app's weight (18px / 1.25).
//
// BD's old icons were fill-based and callers coloured them via `fill`; lucide is
// stroke-based, so a concrete `fill` colour is routed to `color` (→ currentColor
// stroke) and a plain `currentColor` fill is dropped, so a stroke glyph is never
// accidentally filled solid.

import { Box } from "@chakra-ui/react";
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  Braces,
  Check,
  ChevronDown,
  CircleCheck,
  CircleHelp,
  ClockFading,
  Code,
  Copy,
  Database,
  Download,
  EllipsisVertical,
  ExternalLink,
  File,
  FileText,
  Info,
  Lightbulb,
  LogOut,
  MessageCircleMore,
  PanelLeft,
  RotateCw,
  Search,
  Sparkles,
  Table2,
  TableProperties,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  X,
} from "lucide-react";

function makeIcon(Base) {
  function Icon({
    fill,
    color,
    width = "18px",
    height = "18px",
    boxSize,
    strokeWidth = 1.25,
    ...props
  }) {
    const resolvedColor =
      color ?? (fill && fill !== "currentColor" ? fill : undefined);
    return (
      <Box
        as={Base}
        width={boxSize ?? width}
        height={boxSize ?? height}
        color={resolvedColor}
        strokeWidth={strokeWidth}
        {...props}
      />
    );
  }
  return Icon;
}

export const ArrowRightIcon = makeIcon(ArrowRight);
export const ArrowUpIcon = makeIcon(ArrowUp);
export const BracesIcon = makeIcon(Braces);
export const ChartIcon = makeIcon(BarChart3);
export const ChatBubbleDotsIcon = makeIcon(MessageCircleMore);
export const CheckIcon = makeIcon(Check);
export const ChevronDownIcon = makeIcon(ChevronDown);
export const CircleCheckIcon = makeIcon(CircleCheck);
export const ClockFadingIcon = makeIcon(ClockFading);
export const CodeIcon = makeIcon(Code);
export const CopyIcon = makeIcon(Copy);
export const CrossIcon = makeIcon(X);
export const DataBaseIcon = makeIcon(Database);
export const DataStructureIcon = makeIcon(TableProperties);
export const DocIcon = makeIcon(FileText);
export const DownloadIcon = makeIcon(Download);
export const FileGenericIcon = makeIcon(File);
export const HelpIcon = makeIcon(CircleHelp);
export const InfoIcon = makeIcon(Info);
export const LightbulbIcon = makeIcon(Lightbulb);
export const LinkIcon = makeIcon(ExternalLink);
export const MoreVerticalIcon = makeIcon(EllipsisVertical);
export const ReloadIcon = makeIcon(RotateCw);
export const SearchIcon = makeIcon(Search);
export const SidebarIcon = makeIcon(PanelLeft);
export const SparklesIcon = makeIcon(Sparkles);
export const SignOutIcon = makeIcon(LogOut);
export const TableChartViewIcon = makeIcon(Table2);
export const ThumbDownIcon = makeIcon(ThumbsDown);
export const ThumbUpIcon = makeIcon(ThumbsUp);
export const TrashIcon = makeIcon(Trash2);
