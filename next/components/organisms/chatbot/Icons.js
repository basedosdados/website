import { Box } from "@chakra-ui/react";
import {
  ArrowRight,
  ArrowUp,
  Banknote,
  BarChart3,
  Braces,
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
  File,
  GraduationCap,
  HeartPulse,
  Info,
  Leaf,
  Lightbulb,
  LogOut,
  MessageCircleMore,
  MessageSquareText,
  PanelLeft,
  RotateCw,
  Search,
  Sparkles,
  Table2,
  TableProperties,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Vote,
  X,
} from "lucide-react";

function makeIcon(Base) {
  function Icon({
    fill,
    color,
    width = "18px",
    height = "18px",
    boxSize,
    strokeWidth = 1.5,
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
export const BanknoteIcon = makeIcon(Banknote);
export const BracesIcon = makeIcon(Braces);
export const ChartIcon = makeIcon(BarChart3);
export const ChatBubbleDotsIcon = makeIcon(MessageCircleMore);
export const GraduationCapIcon = makeIcon(GraduationCap);
export const HeartPulseIcon = makeIcon(HeartPulse);
export const LeafIcon = makeIcon(Leaf);
export const MessageSquareTextIcon = makeIcon(MessageSquareText);
export const VoteIcon = makeIcon(Vote);
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
export const FileIcon = makeIcon(File);
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
