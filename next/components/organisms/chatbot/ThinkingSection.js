import {
  Box,
  Flex,
  HStack,
  VStack,
  Spinner,
  Collapse,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm-v3";

import BodyText from "../../atoms/Text/BodyText";
import LabelText from "../../atoms/Text/LabelText";
import CheckIcon from "../../../public/img/icons/checkIcon";
import SearchIcon from "../../../public/img/icons/searchIcon";
import DataStructureIcon from "../../../public/img/icons/dataStructureIcon";
import { DataBaseIcon } from "../../../public/img/icons/databaseIcon";
import { CodeIcon } from "../../../public/img/icons/codeIcon";
import {
  componentsMk,
  MemoCodeBlock,
  formatToolOutputText,
  ToolResultView,
  RecordTable,
} from "./markdown";
import { pensandoTextShimmer } from "./shimmer";

const ToolPhrases = {
  search_datasets: {
    running: "Buscando conjuntos de dados",
    done: "Conjuntos de dados encontrados",
    Icon: SearchIcon,
  },
  get_dataset_details: {
    running: "Explorando conjunto de dados",
    done: "Conjunto de dados explorado",
    Icon: DataBaseIcon,
  },
  get_table_details: {
    running: "Explorando estrutura da tabela",
    done: "Estrutura da tabela explorada",
    Icon: DataStructureIcon,
  },
  execute_bigquery_sql: {
    running: "Consultando o BigQuery",
    done: "Consulta ao BigQuery concluída",
    Icon: CodeIcon,
  },
  decode_table_values: {
    running: "Decodificando valores da tabela",
    done: "Valores da tabela decodificados",
    Icon: DataStructureIcon,
  },
};

const FallbackToolPhrases = {
  running: "Executando ferramenta",
  done: "Ferramenta executada",
  Icon: CodeIcon,
};

function getToolStepMeta(name, { done = false } = {}) {
  const phrases = ToolPhrases[name] ?? FallbackToolPhrases;
  return { label: done ? phrases.done : phrases.running, Icon: phrases.Icon };
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function SolicitationArgsBlocks({ call, downloadProps }) {
  const rawStream =
    call &&
    typeof call.streamArgsJson === "string" &&
    call.streamArgsJson.trim() !== ""
      ? call.streamArgsJson
      : null;

  if (rawStream != null) {
    return (
      <MemoCodeBlock language="json" raw>
        {rawStream}
      </MemoCodeBlock>
    );
  }

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

    const calls = Array.isArray(ev.tool_calls) ? ev.tool_calls : [];
    for (const call of calls) {
      if (!call || call.id == null) continue;
      const output = outputByCallId.get(call.id) ?? null;
      if (output) consumedOutputIds.add(call.id);
      steps.push({ kind: "tool", call, output });
    }
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
  const isCodeIcon = Icon === CodeIcon;
  const iconSize = isCodeIcon ? "18px" : "14px";

  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      width="16px"
      height="24px"
      borderRadius="full"
      backgroundColor="#FFFFFF"
      zIndex={1}
    >
      {status === "loading" ? (
        <Spinner width="12px" height="12px" thickness="2px" color={fill} />
      ) : (
        <Icon
          width={iconSize}
          height={iconSize}
          fill={fill}
          margin={isCodeIcon ? undefined : "2px"}
        />
      )}
    </Box>
  );
}

function ToolStepItem({
  step,
  index,
  isFirst,
  isLast,
  isLoadingStep,
  messageId,
  messageLoading,
  onExport,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isOrphan = step.kind === "orphan_output";
  const call = isOrphan ? null : step.call;
  const status = isLoadingStep ? "loading" : "done";
  const { label, Icon } = isOrphan
    ? { label: "Resultado adicional", Icon: CodeIcon }
    : getToolStepMeta(call?.name, { done: status === "done" });
  const hasOutput = Boolean(formatToolOutputText(step.output));
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
      <Box width="16px" position="relative" flexShrink={0}>
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
        <TimelineIcon status={status} Icon={Icon} fill="currentColor"/>
      </Box>

      <Box
        flex={1}
        minWidth={0}
        minHeight={0}
        paddingLeft="8px"
        transition="color 0.2s ease"
        paddingBottom={isLast ? 0 : "8px"}
      >
        <Flex
          cursor="pointer"
          alignItems="center"
          display="inline-flex"
          maxWidth="100%"
          color="currentColor"
          gap="8px"
          minHeight="24px"
          minWidth={0}
          onClick={() => setIsOpen((v) => !v)}
        >
          <LabelText
            as="span"
            typography="small"
            color={status === "loading" ? undefined : "currentColor"}
            animation={
              status === "loading"
                ? `${pensandoTextShimmer} 2s ease-in-out infinite`
                : undefined
            }
            minWidth="0"
          >
            {label}
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
            spacing="8px"
            width="100%"
            minWidth={0}
            minHeight={0}
            marginTop="8px"
          >
            {call && (
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
                  fontSize="12px"
                  fontWeight="600"
                  color="#464A51"
                  textTransform="uppercase"
                  letterSpacing="5%"
                >
                  Solicitação
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
                  fontSize="12px"
                  fontWeight="600"
                  color="#464A51"
                  textTransform="uppercase"
                  letterSpacing="5%"
                >
                  Resultado
                </BodyText>
                <ToolResultView output={step.output} />
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
      <Box width="24px" position="relative" flexShrink={0}>
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
          width="24px"
          height="24px"
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
        paddingLeft="12px"
        paddingBottom={isLast ? 0 : "16px"}
        className="markdown-body"
        fontSize="14px"
        color="#71757A"
        fontStyle="italic"
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
  if (toolSteps.length === 0) return null;

  return (
    <Box
      width="100%"
      overflow="hidden"
    >
      <Box width="100%">
        <VStack spacing="0" align="stretch" width="100%">
          {toolSteps.map((step, index) => {
            const key = stepKey(step, index);
            const isFirst = index === 0;
            const isLast = index === toolSteps.length - 1;

            if (step.kind === "reasoning") {
              return (
                <ReasoningStepItem key={key} step={step} isFirst={isFirst} isLast={isLast} />
              );
            }

            const isLoadingStep = isLoading && step.kind === "tool" && !step.output;

            return (
              <ToolStepItem
                key={key}
                step={step}
                index={index}
                isFirst={isFirst}
                isLast={isLast}
                isLoadingStep={isLoadingStep}
                messageId={messageId}
                messageLoading={isLoading}
                onExport={onExport}
              />
            );
          })}
        </VStack>
      </Box>
    </Box>
  );
}
