import {
  Box,
  Flex,
  VStack,
  Collapse,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm-v3";

import BodyText from "../../atoms/Text/BodyText";
import LabelText from "../../atoms/Text/LabelText";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  ClockFadingIcon,
  SearchIcon,
  DataStructureIcon,
  DataBaseIcon,
  CodeIcon,
  ChevronDownIcon,
  ChartIcon,
  DownloadIcon,
  TableChartViewIcon,
} from "./icons";
import {
  componentsMk,
  markdownContentSx,
  MemoCodeBlock,
  formatToolOutputText,
  ToolResultView,
  RecordTable,
  isToolErrorOutput,
} from "./markdown";
import { renderFriendlyRequest } from "./toolViews";
import TextShimmer from "./TextShimmer";
import useMinDuration from "../../../hooks/useMinDuration";

// Minimum time a tool step shows its "running" state before flipping to done, so fast tools
// still flash a shimmer. Mirrors the reference frontend's RUNNING_DWELL_MS.
const TOOL_RUNNING_DWELL_MS = 700;

const ToolIcons = {
  search_datasets: SearchIcon,
  get_dataset_details: DataBaseIcon,
  get_table_details: DataStructureIcon,
  execute_bigquery_sql: CodeIcon,
  decode_table_values: DataStructureIcon,
  list_query_results: TableChartViewIcon,
  export_query_result: DownloadIcon,
  chart_query_result: ChartIcon,
};

function getToolStepMeta(name, { done = false, error = false, t } = {}) {
  const Icon = done ? CircleCheckIcon : ToolIcons[name] ?? CodeIcon;
  const keyBase = ToolIcons[name]
    ? `ui.thinking.tools.${name}`
    : "ui.thinking.tools.fallback";
  const state = error ? "error" : done ? "done" : "running";
  return { label: t(`${keyBase}.${state}`), Icon };
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function SolicitationArgsBlocks({ call, downloadProps }) {
  const parsed = call.args ?? {};

  if (call?.name === "execute_bigquery_sql" && isPlainObject(parsed)) {
    const sqlQuery =
      typeof parsed.sql_query === "string" && parsed.sql_query.trim()
        ? parsed.sql_query.trim()
        : "";
    const slug =
      typeof parsed.slug === "string" && parsed.slug.trim()
        ? parsed.slug.trim()
        : "";

    return (
      <MemoCodeBlock
        language="sql"
        marginY={0}
        title={slug}
        downloadProps={downloadProps}
      >
        {sqlQuery}
      </MemoCodeBlock>
    );
  }

  const friendly = renderFriendlyRequest(call?.name, parsed);
  if (friendly) return friendly;

  if (isPlainObject(parsed) && Object.keys(parsed).length > 0) {
    return <RecordTable record={parsed} />;
  }

  return (
    <MemoCodeBlock language="json" marginY={0}>
      {JSON.stringify(parsed ?? {}, null, 2)}
    </MemoCodeBlock>
  );
}

export function buildToolSteps(toolCalls) {
  if (!Array.isArray(toolCalls) || toolCalls.length === 0) return [];

  const outputByCallId = new Map();
  for (const ev of toolCalls) {
    if (!ev || typeof ev !== "object" || ev.type !== "tool_output") continue;
    if (!Array.isArray(ev.tool_outputs)) continue;
    for (const o of ev.tool_outputs) {
      if (o && o.tool_call_id != null) outputByCallId.set(o.tool_call_id, o);
    }
  }

  const steps = [];
  const consumedOutputIds = new Set();

  for (const ev of toolCalls) {
    if (!ev || typeof ev !== "object" || ev.type !== "tool_call") continue;

    if (typeof ev.content === "string" && ev.content.trim()) {
      steps.push({ kind: "reasoning", markdown: ev.content });
    }

    const calls = (Array.isArray(ev.tool_calls) ? ev.tool_calls : []).filter(
      (call) => call && call.id != null
    );
    calls.forEach((call, batchPos) => {
      const output = outputByCallId.get(call.id) ?? null;
      if (output) consumedOutputIds.add(call.id);
      steps.push({
        kind: "tool",
        call,
        output,
        batchSize: calls.length,
        batchPos,
      });
    });
  }

  for (const [callId, output] of outputByCallId) {
    if (consumedOutputIds.has(callId) || !output) continue;
    if (!formatToolOutputText(output)) continue;
    steps.push({ kind: "orphan_output", callId, output });
  }

  return steps;
}

function stepKey(step, index) {
  if (step.kind === "tool") return String(step.call.id);
  if (step.kind === "orphan_output") return `orphan-${String(step.callId)}`;
  return `reasoning-${index}`;
}

function TimelineIcon({ status, Icon, fill }) {
  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      width="20px"
      height="24px"
      borderRadius="full"
      backgroundColor="#FFFFFF"
      zIndex={1}
    >
      {status === "loading" ? (
        <ClockFadingIcon width="16px" height="16px" fill={fill} />
      ) : (
        <Icon width="16px" height="16px" fill={fill} />
      )}
    </Box>
  );
}

const ICON_CENTER_Y = 12;
const BRACKET_LEFT = -8;

function ParallelBracket({ batchPos, batchSize }) {
  const isFirst = batchPos === 0;
  const isLast = batchPos === batchSize - 1;
  return (
    <>
      <Box
        aria-hidden
        position="absolute"
        width="2px"
        backgroundColor="#E5E7EB"
        left={`${BRACKET_LEFT}px`}
        top={isFirst ? `${ICON_CENTER_Y}px` : "0"}
        bottom={isLast ? `calc(100% - ${ICON_CENTER_Y}px)` : "0"}
      />
      <Box
        aria-hidden
        position="absolute"
        height="2px"
        backgroundColor="#E5E7EB"
        left={`${BRACKET_LEFT}px`}
        width={`${-BRACKET_LEFT}px`}
        top={`${ICON_CENTER_Y - 1}px`}
      />
    </>
  );
}

function ToolStepItem({
  step,
  index,
  isFirst,
  isLast,
  messageId,
  messageLoading,
  onExport,
}) {
  const { t } = useTranslation("chatbot");
  const [isOpen, setIsOpen] = useState(false);
  const isOrphan = step.kind === "orphan_output";
  const call = isOrphan ? null : step.call;
  const resultReady = Boolean(formatToolOutputText(step.output));
  // Keep a tool step in its "running" state for a minimum time, so fast tools still flash a
  // shimmer instead of snapping straight to done. Loaded history is settled immediately.
  const [dwellPassed, setDwellPassed] = useState(!messageLoading);
  useEffect(() => {
    if (!messageLoading) {
      setDwellPassed(true);
      return undefined;
    }
    const id = setTimeout(() => setDwellPassed(true), TOOL_RUNNING_DWELL_MS);
    return () => clearTimeout(id);
  }, [messageLoading]);
  const settled = isOrphan || (resultReady && dwellPassed);
  const status = messageLoading && !settled ? "loading" : "done";
  const isError = settled && isToolErrorOutput(step.output);
  const batchSize = step.batchSize ?? 1;
  const batchPos = step.batchPos ?? 0;
  const isParallel = batchSize > 1;
  const spineTop = isParallel ? batchPos === 0 && !isFirst : !isFirst;
  const spineBottom = isParallel
    ? batchPos === batchSize - 1 && !isLast
    : !isLast;
  const { label, Icon } = isOrphan
    ? { label: t("ui.thinking.additionalResult"), Icon: CircleCheckIcon }
    : getToolStepMeta(call?.name, { done: status === "done", error: isError, t });
  // The request card shows once the (complete) args are present; the result card shows once
  // the step has settled — output present and the running dwell elapsed — so neither flashes.
  const hasRequest =
    Boolean(call) && isPlainObject(call.args) && Object.keys(call.args).length > 0;
  const hasOutput = settled && resultReady;
  const downloadProps =
    step.output?.artifact?.type === "query_result"
      ? {
          messageId,
          artifact: step.output.artifact,
          onExport,
          disabled: messageLoading,
        }
      : null;

  return (
    <Flex
      width="100%"
      position="relative"
      color="#71757A"
      _hover={{
        color: "#464A51",
      }}
    >
      <Box width="20px" position="relative" flexShrink={0}>
        {spineTop && (
          <Box
            position="absolute"
            top="0"
            left="50%"
            transform="translateX(-50%)"
            width="2px"
            height="10px"
            backgroundColor="#E5E7EB"
          />
        )}
        {spineBottom && (
          <Box
            position="absolute"
            bottom="0"
            left="50%"
            transform="translateX(-50%)"
            top="10px"
            width="2px"
            backgroundColor="#E5E7EB"
          />
        )}
        {isParallel && (
          <ParallelBracket batchPos={batchPos} batchSize={batchSize} />
        )}
        <TimelineIcon
          status={status}
          Icon={isError ? CircleAlertIcon : Icon}
          fill="currentColor"
        />
      </Box>

      <Box
        flex={1}
        minWidth={0}
        minHeight={0}
        paddingLeft="4px"
        transition="color 0.2s ease"
        paddingBottom={isLast ? 0 : "8px"}
      >
        <Flex
          cursor="pointer"
          alignItems="center"
          display="inline-flex"
          maxWidth="100%"
          color="currentColor"
          gap="4px"
          minHeight="24px"
          minWidth={0}
          onClick={() => setIsOpen((v) => !v)}
        >
          <LabelText
            as="span"
            typography="small"
            color="currentColor"
            minWidth="0"
          >
            {status === "loading" ? <TextShimmer>{label}</TextShimmer> : label}
          </LabelText>
          <ChevronDownIcon
            boxSize="16px"
            flexShrink={0}
            color="currentColor"
            transform={isOpen ? "rotate(-180deg)" : undefined}
            transition="transform 0.2s ease"
          />
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <VStack
            align="stretch"
            spacing="4px"
            width="100%"
            minWidth={0}
            minHeight={0}
            marginTop="8px"
          >
            {call && hasRequest && (
              <VStack
                align="stretch"
                spacing="8px"
                width="100%"
                minWidth={0}
                minHeight={0}
                padding="12px"
                borderRadius="12px"
                border="1px solid #E5E7EB"
              >
                <BodyText
                  typography="small"
                  fontSize="11px"
                  fontWeight="500"
                  color="#71757A"
                  textTransform="uppercase"
                  letterSpacing="0.05em"
                >
                  {t("ui.thinking.request")}
                </BodyText>
                <SolicitationArgsBlocks call={call} downloadProps={downloadProps} />
              </VStack>
            )}
            {hasOutput && (
              <VStack
                align="stretch"
                spacing="8px"
                width="100%"
                minWidth={0}
                minHeight={0}
                padding="12px"
                borderRadius="12px"
                border="1px solid #E5E7EB"
              >
                <BodyText
                  typography="small"
                  fontSize="11px"
                  fontWeight="500"
                  color="#71757A"
                  textTransform="uppercase"
                  letterSpacing="0.05em"
                >
                  {isError ? t("ui.error") : t("ui.thinking.result")}
                </BodyText>
                {isError ? (
                  <BodyText typography="small" color="#71757A">
                    {t("ui.thinking.errorMessage")}
                  </BodyText>
                ) : (
                  <ToolResultView output={step.output} name={call?.name} />
                )}
              </VStack>
            )}
          </VStack>
        </Collapse>
      </Box>
    </Flex>
  );
}

function ReasoningStepItem({ step, isFirst, isLast }) {
  return (
    <Flex width="100%" position="relative">
      <Box width="20px" position="relative" flexShrink={0}>
        {!isFirst && (
          <Box
            position="absolute"
            top="0"
            left="50%"
            transform="translateX(-50%)"
            width="2px"
            height="10px"
            backgroundColor="#E5E7EB"
          />
        )}
        {!isLast && (
          <Box
            position="absolute"
            bottom="0"
            left="50%"
            transform="translateX(-50%)"
            top="10px"
            width="2px"
            backgroundColor="#E5E7EB"
          />
        )}
        <Box
          position="relative"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          width="20px"
          height="24px"
          backgroundColor="#FFFFFF"
          zIndex={1}
        >
          <Box
            width="6px"
            height="6px"
            borderRadius="full"
            backgroundColor="#9CA3AF"
          />
        </Box>
      </Box>
      <Box
        flex={1}
        minWidth={0}
        paddingLeft="4px"
        paddingBottom={isLast ? 0 : "16px"}
        className="markdown-body"
        fontSize="14px"
        color="#71757A"
        fontStyle="italic"
        sx={markdownContentSx}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={componentsMk}>
          {step.markdown}
        </ReactMarkdown>
      </Box>
    </Flex>
  );
}

export default function ThinkingSection({
  toolSteps,
  isLoading,
  messageId,
  onExport,
}) {
  const { t } = useTranslation("chatbot");
  const [open, setOpen] = useState(true);
  const loading = useMinDuration(isLoading, 600);

  if (toolSteps.length === 0) return null;

  return (
    <Box width="100%" overflow="hidden">
      <Flex
        as="button"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        alignItems="center"
        gap="6px"
        color="#71757A"
        cursor="pointer"
        transition="color 0.2s ease"
        _hover={{ color: "#464A51" }}
      >
        <LabelText as="span" typography="small" color="currentColor">
          {loading ? (
            <TextShimmer>{t("ui.thinking.header.thinking")}</TextShimmer>
          ) : (
            t("ui.thinking.header.done")
          )}
        </LabelText>
        <ChevronDownIcon
          boxSize="16px"
          flexShrink={0}
          color="currentColor"
          transform={open ? "rotate(-180deg)" : undefined}
          transition="transform 0.2s ease"
        />
      </Flex>

      <Collapse in={open} animateOpacity>
        <VStack
          spacing="0"
          align="stretch"
          width="100%"
          marginTop="12px"
          paddingLeft="8px"
        >
          {toolSteps.map((step, index) => {
            const key = stepKey(step, index);
            const isFirst = index === 0;
            const isLast = index === toolSteps.length - 1;

            if (step.kind === "reasoning") {
              return (
                <ReasoningStepItem key={key} step={step} isFirst={isFirst} isLast={isLast} />
              );
            }

            return (
              <ToolStepItem
                key={key}
                step={step}
                index={index}
                isFirst={isFirst}
                isLast={isLast}
                messageId={messageId}
                messageLoading={isLoading}
                onExport={onExport}
              />
            );
          })}
        </VStack>
      </Collapse>
    </Box>
  );
}
