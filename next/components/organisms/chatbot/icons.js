import { Box } from "@chakra-ui/react";
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  ClockFading,
  Code,
  Copy,
  Database,
  Download,
  EllipsisVertical,
  ExternalLink,
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
export const ChartIcon = makeIcon(BarChart3);
export const ChatBubbleDotsIcon = makeIcon(MessageCircleMore);
export const CheckIcon = makeIcon(Check);
export const ChevronDownIcon = makeIcon(ChevronDown);
export const CircleAlertIcon = makeIcon(CircleAlert);
export const CircleCheckIcon = makeIcon(CircleCheck);
export const ClockFadingIcon = makeIcon(ClockFading);
export const CodeIcon = makeIcon(Code);
export const CopyIcon = makeIcon(Copy);
export const CrossIcon = makeIcon(X);
export const DataBaseIcon = makeIcon(Database);
export const DataStructureIcon = makeIcon(TableProperties);
export const DownloadIcon = makeIcon(Download);
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
