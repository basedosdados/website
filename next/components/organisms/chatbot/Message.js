import {
  Box,
  Flex,
  Text,
  HStack,
  useToast,
  Collapse,
  Divider,
  VStack,
  UnorderedList,
  ListItem,
  OrderedList,
  useClipboard,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { ChevronDownIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { keyframes } from "@emotion/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import "highlight.js/styles/github.css";
import hljs from "highlight.js/lib/core";
import sql from "highlight.js/lib/languages/sql";
import json from "highlight.js/lib/languages/json";

import remarkGfm from "remark-gfm-v3";
import BodyText from "../../atoms/Text/BodyText";
import LabelText from "../../atoms/Text/LabelText";
import Link from "../../atoms/Link";
import { CopyIcon } from "../../../public/img/icons/copyIcon";
import CheckIcon from "../../../public/img/icons/checkIcon";
import ThumbUpIcon from "../../../public/img/icons/thumbUpIcon";
import ThumbDownIcon from "../../../public/img/icons/thumbDownIcon";
import FeedbackModal from "./FeedbackModal";
import LinkIcon from "../../../public/img/icons/redirectIcon";
import { DataBaseIcon } from "../../../public/img/icons/databaseIcon";
import { CalendarComunIcon } from "../../../public/img/icons/calendarIcon";
import { CodeIcon } from "../../../public/img/icons/codeIcon";

hljs.registerLanguage("sql", sql);
hljs.registerLanguage("json", json);

const pensandoTextShimmer = keyframes`
  0%, 100% { color: #6B7280; }
  50% { color: #252A32; }
`;

function CodeBlock({ inline, children, language = "sql", marginY = "24px", raw = false }) {
  const code = String(children).replace(/\n$/, "");
  const { hasCopied, onCopy } = useClipboard(code);

  const highlighted = useMemo(
    () => (inline || raw ? null : hljs.highlight(code, { language })),
    [inline, raw, code, language]
  );

  if (inline) {
    return (
      <Text
        as="code"
        fontFamily="ui-monospace, monospace"
        backgroundColor="#f7f7f7"
        color="#158237"
        fontSize="90%"
        padding="2px 6px"
        borderRadius="4px"
      >
        {code}
      </Text>
    );
  }

  return (
    <Box
      position="relative"
      marginY={marginY}
      borderRadius="12px"
      backgroundColor="#F9FAFB"
      overflow="hidden"
      border="1px solid #E5E7EB"
      width="100%"
      maxW="100%"
      minW={0}
      alignSelf="stretch"
    >
      <Box
        cursor="pointer"
        position="absolute"
        top="12px"
        right="12px"
        display="flex"
        alignItems="center"
        width="16px"
        height="16px"
        fill="#252A32"
        onClick={onCopy}
        zIndex="1"
        backgroundColor="transparent"
      >
        {hasCopied ? (
          <CheckIcon width="16px" height="16px"/>
        ) : (
          <CopyIcon width="16px" height="16px" _hover={{ opacity: 0.7 }}/>
        )}
      </Box>

      <Box
        as="pre"
        display="block"
        width="100%"
        maxW="100%"
        minW={0}
        maxHeight="70vh"
        overflow="auto"
        fontSize="14px"
        backgroundColor="#F9FAFB"
        margin={0}
        padding="12px 40px 12px 12px"
        boxSizing="border-box"
      >
        {raw ? (
          <Box
            as="code"
            display="block"
            width="max-content"
            minW="100%"
            boxSizing="border-box"
            className={`hljs-chatbot language-${language}`}
            color="#1F2937"
          >
            {code}
          </Box>
        ) : (
          <Box
            as="code"
            display="block"
            width="max-content"
            minW="100%"
            boxSizing="border-box"
            className={`hljs hljs-chatbot language-${language}`}
            color="#1F2937"
            dangerouslySetInnerHTML={{ __html: highlighted.value }}
          />
        )}
      </Box>
    </Box>
  );
}

const MemoCodeBlock = React.memo(CodeBlock);

const componentsMk = {
  p: ({ children }) => (
    <BodyText as="p" color="#252A32" marginBottom="4px">
      {children}
    </BodyText>
  ),
  a: ({ children, href }) => (
    <BodyText as="a" color="#0068C5" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </BodyText>
  ),
  strong: ({ children }) => (
    <Text as="strong" fontWeight="bold" color="#252A32">
      {children}
    </Text>
  ),
  em: ({ children }) => (
    <Text as="em" fontStyle="italic" color="#252A32">
      {children}
    </Text>
  ),
  code: ({ children, inline }) => <MemoCodeBlock inline={inline} children={children} />,
  ul: ({ children }) => (
    <UnorderedList margin="8px 0 8px 20px">
      {children}
    </UnorderedList>
  ),
  ol: ({ children }) => (
    <OrderedList >
      {children}
    </OrderedList>
  ),
  li: ({ children }) => (
    <ListItem
      fontFamily="Roboto"
      fontWeight="400"
      fontSize="16px"
      lineHeight="20px"
      color="#252A32"
      margin="0 0 4px 0"
    >
      {children}
    </ListItem>
  ),
  table: ({ children }) => (
    <TableContainer
      marginY="16px"
      maxWidth="100%"
      overflowX="auto"
      border="1px solid #DEDFE0"
      borderRadius="20px"
    >
      <Table variant="simple" size="sm">
        {children}
      </Table>
    </TableContainer>
  ),
  thead: ({ children }) => (
    <Thead backgroundColor="#F7F7F7">{children}</Thead>
  ),
  tbody: ({ children }) => <Tbody>{children}</Tbody>,
  tr: ({ children }) => <Tr>{children}</Tr>,
  td: ({ children }) => (
    <Td
      padding="14px 22px"
      fontFamily="Roboto"
      fontWeight="400"
      fontSize="14px"
      lineHeight="20px"
      color="#464A51"
      backgroundColor="#FFF"
      borderColor="#DEDFE0"
      textTransform="none"
      letterSpacing="inherit"
      whiteSpace="break-spaces"
    >
      {children}
    </Td>
  ),
  th: ({ children }) => (
    <Th
      padding="14px 22px"
      textTransform="none"
      letterSpacing="inherit"
      fontFamily="Roboto"
      fontWeight="400"
      fontSize="14px"
      lineHeight="20px"
      color="#252A32"
      borderBottom="1px solid #DEDFE0 !important"
      boxSizing="content-box"
    >
      {children}
    </Th>
  ),
}

function formatToolOutputText(output) {
  if (!output) return "";
  const toolResult = output.content ?? output.output ?? output.result;
  if (typeof toolResult === "string") {
    if (output.streaming) return toolResult;
    const trimmed = toolResult.trim();
    if (!trimmed) return toolResult;
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed !== null && typeof parsed === "object") {
        return JSON.stringify(parsed, null, 2);
      }
      return toolResult;
    } catch {
      return toolResult;
    }
  }
  if (toolResult != null) return JSON.stringify(toolResult, null, 2);
  return "";
}

function SolicitationArgsBlocks({ call }) {
  const rawStream =
    call &&
    typeof call.streamArgsJson === "string" &&
    call.streamArgsJson.trim() !== ""
      ? call.streamArgsJson
      : null;

  if (rawStream != null) {
    return (
      <MemoCodeBlock language="json" marginY="8px" raw>
        {rawStream}
      </MemoCodeBlock>
    );
  }

  const parsed = call.args ?? {};

  if (parsed == null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return (
      <MemoCodeBlock language="json" marginY="8px">
        {JSON.stringify(parsed ?? {}, null, 2)}
      </MemoCodeBlock>
    );
  }

  const sql =
    typeof parsed.sql_query === "string" && parsed.sql_query.trim()
      ? parsed.sql_query.trim()
      : null;

  if (sql) {
    const { sql_query: _omitSql, ...rest } = parsed;
    return (
      <>
        <MemoCodeBlock language="sql" marginY="8px">
          {sql}
        </MemoCodeBlock>
        {Object.keys(rest).length > 0 ? (
          <MemoCodeBlock language="json" marginY="8px">
            {JSON.stringify(rest, null, 2)}
          </MemoCodeBlock>
        ) : null}
      </>
    );
  }

  return (
    <MemoCodeBlock language="json" marginY="8px">
      {JSON.stringify(parsed, null, 2)}
    </MemoCodeBlock>
  );
}

const GRANULARITY_LABEL = {
  day: "dia",
  month: "mês",
  year: "ano",
};

function getDatasetTableUrl(source) {
  const datasetId = source?.dataset_id ?? source?.datasetId;
  const tableId = source?.table_id ?? source?.tableId;
  if (!datasetId) return null;
  const base = `/dataset/${datasetId}`;
  return tableId ? `${base}?table=${tableId}` : base;
}

function formatPeriodDate(date) {
  if (!date || typeof date !== "string") return date;
  return date.replace(/-/g, "/");
}

function StructuredSectionHeader({ icon, title }) {
  return (
    <HStack spacing="8px" alignItems="center" flex={1} minW={0}>
      <Box
        as="span"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
        color="#6B7280"
      >
        {icon}
      </Box>
      <BodyText typography="small" fontWeight="600" color="#6B7280">
        {title}
      </BodyText>
    </HStack>
  );
}

const DataSourcesList = React.memo(function DataSourcesList({ dataSources }) {
  if (!Array.isArray(dataSources) || dataSources.length === 0) return null;

  return (
    <Box>
      <StructuredSectionHeader
        title="Fontes dos dados"
        icon={<DataBaseIcon width="16px" height="16px" fill="#6B7280"/>}
      />
      <VStack align="stretch" spacing="4px" marginTop="4px">
        {dataSources.map((source, index) => {
          const href = getDatasetTableUrl(source);
          const label = source?.name ?? "—";

          return (
            <Box
              key={source?.table_id ?? index}
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="14px"
              lineHeight="20px"
              color="#252A32"
            >
              {href ? (
                <Link
                  display="inline-flex"
                  alignItems="center"
                  gap="6px"
                  href={href}
                  target="_blank"
                  color="#0068C5"
                  fill="#0068C5"
                  fontWeight="400"
                  _hover={{
                    color: "#0057A4",
                    fill: "#0057A4",
                    textDecoration: "underline",
                  }}
                >
                  <Text as="span">{label}</Text>
                  <LinkIcon width="14px" height="14px" />
                </Link>
              ) : (
                label
              )}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
});

const TemporalCoverageInfo = React.memo(function TemporalCoverageInfo({ temporalCoverage }) {
  if (!temporalCoverage) return null;

  const { period_start, period_end, granularity } = temporalCoverage;
  const granularityLabel = GRANULARITY_LABEL[granularity] ?? granularity;
  const formattedStart = formatPeriodDate(period_start);
  const formattedEnd = formatPeriodDate(period_end);

  return (
    <Box>
      <StructuredSectionHeader
        title="Período consultado"
        icon={<CalendarComunIcon width="16px" height="16px" fill="#6B7280" />}
      />
      <BodyText typography="small" color="#252A32" marginTop="4px">
        {period_start === period_end
          ? `${formattedStart} (${granularityLabel})`
          : `${formattedStart} a ${formattedEnd} (${granularityLabel})`}
      </BodyText>
    </Box>
  );
});

const SqlQueriesList = React.memo(function SqlQueriesList({ sqlQueries }) {
  if (!Array.isArray(sqlQueries) || sqlQueries.length === 0) return null;

  return (
    <Box width="100%" maxW="100%" minW={0} overflow="hidden">
      <Accordion allowToggle width="100%">
        <AccordionItem border="none" width="100%" minW={0}>
          <AccordionButton
            padding="0"
            width="100%"
            minW={0}
            _hover={{ background: "transparent" }}
            _expanded={{ background: "transparent" }}
          >
            <StructuredSectionHeader
              title="Consultas SQL"
              icon={<CodeIcon width="16px" height="16px" fill="#6B7280"/>}
            />
            <AccordionIcon color="#6B7280" marginLeft="8px" flexShrink={0} />
          </AccordionButton>
          <AccordionPanel
            padding="8px 0 0 0"
            width="100%"
            maxW="100%"
            minW={0}
            overflow="hidden"
          >
            {sqlQueries.map((query, index) => (
              <MemoCodeBlock key={index} language="sql" marginY="8px">
                {query}
              </MemoCodeBlock>
            ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
});

const FollowUpQuestionsList = React.memo(function FollowUpQuestionsList({ followUpQuestions, onQuestionClick }) {
  if (!Array.isArray(followUpQuestions) || followUpQuestions.length === 0) return null;

  return (
    <Box marginTop="16px">
      <BodyText typography="small" fontWeight="600" color="#6B7280" marginBottom="8px">
        Perguntas sugeridas
      </BodyText>
      <VStack align="stretch" spacing="4px">
        {followUpQuestions.map((question, index) => (
          <HStack
            key={index}
            as="button"
            type="button"
            width="100%"
            spacing="8px"
            align="flex-start"
            textAlign="left"
            padding="6px 0"
            background="transparent"
            border="none"
            cursor="pointer"
            color="#464A51"
            transition="color 0.2s ease"
            _hover={{ color: "#0068C5" }}
            onClick={() => onQuestionClick?.(question)}
          >
            <ArrowForwardIcon
              boxSize="14px"
              flexShrink={0}
              marginTop="3px"
              color="currentColor"
            />
            <BodyText typography="small" color="inherit" flex={1}>
              {question}
            </BodyText>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
});

function buildToolSteps(toolCalls) {
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

function Message({ message, onFeedback, showFollowUpQuestions = false, onFollowUpClick }) {
  const isUser = message.role === "user";
  const [feedback, setFeedback] = useState(message.rating ?? null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [pendingRating, setPendingRating] = useState(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isThinkingOpen, setIsThinkingOpen] = useState(false);
  const toast = useToast();

  const toolSteps = useMemo(
    () => buildToolSteps(message.toolCalls),
    [message.toolCalls]
  );

  const showThinkingSection =
    !isUser && !message.isError && toolSteps.length > 0;

  const showPensando =
    !isUser &&
    message.isLoading &&
    !message.isError &&
    !(message.content || "").trim() &&
    toolSteps.length === 0;

  const hasAutoOpenedThinkingRef = useRef(false);

  useEffect(() => {
    if (!message.isLoading) {
      hasAutoOpenedThinkingRef.current = false;
      return;
    }
    if (toolSteps.length > 0 && !hasAutoOpenedThinkingRef.current) {
      hasAutoOpenedThinkingRef.current = true;
    }
  }, [message.isLoading, toolSteps.length]);

  useEffect(() => {
    if (message.rating != null) {
      setFeedback(message.rating);
    }
  }, [message.rating]);

  const showFeedbackToast = () => {
    toast({
      duration: 3000,
      position: "bottom",
      render: () => (
        <Box
          width="fit-content"
          display="flex"
          flexDirection="row"
          gap="8px"
          padding="12px 16px"
          backgroundColor="#252A32"
          borderRadius="8px"
          color="#FFF"
          fill="#FFF"
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="14px"
          lineHeight="20px"
        >
          Obrigado pelo seu feedback!
        </Box>
      ),
    });
  };

  const openFeedbackModal = (rating) => {
    if (feedback != null) return;
    setPendingRating(rating);
    setIsFeedbackModalOpen(true);
  };

  const closeFeedbackModal = () => {
    if (isSubmittingFeedback) return;
    setIsFeedbackModalOpen(false);
    setPendingRating(null);
  };

  const handleFeedbackSubmit = async (content) => {
    if (!onFeedback || pendingRating == null) return;

    setIsSubmittingFeedback(true);
    try {
      const success = await onFeedback(message.id, pendingRating, content);
      if (success) {
        setFeedback(pendingRating);
        setIsFeedbackModalOpen(false);
        setPendingRating(null);
        showFeedbackToast();
      }
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <Flex
      width="100%"
      maxWidth="760px"
      margin="0 auto"
      justify={isUser ? "flex-end" : "flex-start"}
    >
      <Box
        maxWidth={isUser ? "80%" : "100%"}
        width={isUser ? "fit-content" : "100%"}
        minW={isUser ? undefined : 0}
        borderRadius="12px"
        padding="16px"
        backgroundColor={isUser ? "#F7F7F7" : "#FFFFFF"}
        color="#000"
      >
        {showThinkingSection && (
          <Box
            width="100%"
            marginBottom="24px"
            border="1px solid #E5E7EB"
            borderRadius="12px"
            overflow="hidden"
          >
            <Flex
              cursor="pointer"
              alignItems="center"
              justifyContent="space-between"
              gap="12px"
              padding="12px 16px"
              width="100%"
              minW={0}
              _hover={{
                opacity: 0.9,
              }}
              transition="opacity 0.2s ease"
              onClick={() => setIsThinkingOpen(!isThinkingOpen)}
            >
              <HStack
                flex={1}
                minWidth="0"
                spacing="8px"
                alignItems="center"
              >
                {message.isLoading ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    animation={`${pensandoTextShimmer} 2s ease-in-out infinite`}
                  >
                    <Spinner
                      width="16px"
                      height="16px"
                      thickness="2px"
                      color="currentColor"
                    />
                  </Box>
                ) : (
                  <Box
                    as="span"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    color="#2B8C4D"
                  >
                    <CheckIcon width="16px" height="16px" />
                  </Box>
                )}
                <LabelText
                  typography="small"
                  fontWeight="500"
                  flex={1}
                  minWidth="0"
                  animation={
                    message.isLoading
                      ? `${pensandoTextShimmer} 2s ease-in-out infinite`
                      : undefined
                  }
                >
                  {message.isLoading
                    ? "Consultando a Base dos Dados..."
                    : "Concluído! Clique para ver os detalhes da consulta"}
                </LabelText>
              </HStack>
              <ChevronDownIcon
                boxSize="18px"
                flexShrink={0}
                color="#252A32"
                transform={isThinkingOpen ? "rotate(-180deg)" : undefined}
                transition="transform 0.2s ease"
              />
            </Flex>
            <Collapse in={isThinkingOpen} animateOpacity>
              <Box
                padding="16px"
                borderTop="1px solid #E5E7EB"
                width="100%"
              >
                <VStack spacing="12px" align="stretch" width="100%">
                  {toolSteps.map((step, index) => (
                    <Box
                      key={
                        step.kind === "tool"
                          ? String(step.call.id)
                          : step.kind === "orphan_output"
                            ? `orphan-${String(step.callId)}`
                            : `reasoning-${index}`
                      }
                      padding="12px"
                      borderRadius="12px"
                      border="1px solid #E5E7EB"
                      width="100%"
                      maxW="100%"
                      minW={0}
                    >
                      {step.kind === "reasoning" ? (
                        <Box
                          className="markdown-body"
                          fontSize="14px"
                          width="100%"
                          minW={0}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={componentsMk}
                          >
                            {step.markdown}
                          </ReactMarkdown>
                        </Box>
                      ) : step.kind === "tool" ? (
                        <VStack
                          align="stretch"
                          spacing="12px"
                          width="100%"
                          minW={0}
                        >
                          <BodyText fontWeight="600" color="#374151">
                            Ferramenta:{" "}
                            <MemoCodeBlock inline language="sql">
                              {step.call.name ?? "—"}
                            </MemoCodeBlock>
                          </BodyText>
                          <VStack
                            align="stretch"
                            spacing="4px"
                            width="100%"
                            minW={0}
                          >
                            <BodyText
                              typography="small"
                              fontWeight="600"
                              color="#6B7280"
                            >
                              Solicitação:
                            </BodyText>
                            <SolicitationArgsBlocks call={step.call} />
                          </VStack>
                          {step.output ? (
                            <VStack
                              align="stretch"
                              spacing="4px"
                              width="100%"
                              minW={0}
                            >
                              <BodyText
                                typography="small"
                                fontWeight="600"
                                color="#6B7280"
                              >
                                Resultado:
                              </BodyText>
                              <MemoCodeBlock
                                language="json"
                                marginY="8px"
                                raw={Boolean(step.output?.streaming)}
                              >
                                {formatToolOutputText(step.output)}
                              </MemoCodeBlock>
                            </VStack>
                          ) : null}
                        </VStack>
                      ) : (
                        <VStack
                          align="stretch"
                          spacing="4px"
                          width="100%"
                          minW={0}
                        >
                          <BodyText
                            typography="small"
                            fontWeight="600"
                            color="#6B7280"
                          >
                            Resultado:
                          </BodyText>
                          <MemoCodeBlock
                            language="json"
                            marginY="8px"
                            raw={Boolean(step.output?.streaming)}
                          >
                            {formatToolOutputText(step.output)}
                          </MemoCodeBlock>
                        </VStack>
                      )}
                    </Box>
                  ))}
                </VStack>
              </Box>
            </Collapse>
          </Box>
        )}

        {showPensando && (
          <HStack
            spacing="12px"
            align="center"
            marginBottom="16px"
            width="100%"
          >
            <LabelText
              fontWeight="500"
              animation={`${pensandoTextShimmer} 2s ease-in-out infinite`}
            >
              Pensando...
            </LabelText>
          </HStack>
        )}

        {!isUser && !message.isLoading && message.structuredResponse && (
          <VStack spacing="16px" width="100%" maxW="100%" minW={0} alignItems="stretch" margin="16px 0">
            <DataSourcesList dataSources={message.structuredResponse.data_sources} />
            <TemporalCoverageInfo temporalCoverage={message.structuredResponse.temporal_coverage} />
            <SqlQueriesList sqlQueries={message.structuredResponse.sql_queries} />
          </VStack>
        )}

        {isUser ? (
          <BodyText whiteSpace="pre-wrap">{message.content}</BodyText>
        ) : (
          <Box className="markdown-body" fontSize="16px">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={componentsMk}
            >
              {message.content}
            </ReactMarkdown>
          </Box>
        )}

        {!isUser && !message.isLoading && !message.isTyping && message.structuredResponse && showFollowUpQuestions ? (
          <FollowUpQuestionsList
            followUpQuestions={message.structuredResponse.follow_up_questions}
            onQuestionClick={onFollowUpClick}
          />
        ) : null}

        {!isUser &&
          !message.isLoading &&
          !message.isTyping &&
          !message.isError &&
          message.id && (
            <HStack spacing="8px" marginTop="8px" justify="flex-end">
              <Box
                cursor={feedback != null ? "default" : "pointer"}
                onClick={() => openFeedbackModal(1)}
                pointerEvents={feedback != null ? "none" : "auto"}
                opacity={feedback === 1 ? 1 : 0.5}
                _hover={{ opacity: feedback != null ? undefined : 1 }}
              >
                <ThumbUpIcon width="18px" height="18px" />
              </Box>
              <Box
                cursor={feedback != null ? "default" : "pointer"}
                onClick={() => openFeedbackModal(0)}
                pointerEvents={feedback != null ? "none" : "auto"}
                opacity={feedback === 0 ? 1 : 0.5}
                _hover={{ opacity: feedback != null ? undefined : 1 }}
              >
                <ThumbDownIcon width="18px" height="18px" />
              </Box>
            </HStack>
          )}

        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={closeFeedbackModal}
          rating={pendingRating}
          onSubmit={handleFeedbackSubmit}
          isSubmitting={isSubmittingFeedback}
        />
      </Box>
    </Flex>
  );
}

export default React.memo(Message);
