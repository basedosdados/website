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
} from "@chakra-ui/react";
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
import { CopyIcon } from "../../../public/img/icons/copyIcon";
import CheckIcon from "../../../public/img/icons/checkIcon";
import ThumbUpIcon from "../../../public/img/icons/thumbUpIcon";
import ThumbDownIcon from "../../../public/img/icons/thumbDownIcon";
import CrossIcon from "../../../public/img/icons/crossIcon";

hljs.registerLanguage("sql", sql);
hljs.registerLanguage("json", json);

const pensandoTextShimmer = keyframes`
  0%, 100% { color: #6B7280; }
  50% { color: #252A32; }
`;

function CodeBlock({ inline, children, language = "sql", marginY = "24px" }) {
  const code = String(children).replace(/\n$/, "");
  const { hasCopied, onCopy } = useClipboard(code);

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

  const highlighted = hljs.highlight(code, { language });

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
      </Box>
    </Box>
  );
}

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
  code: ({ children, inline }) => <CodeBlock inline={inline} children={children} />,
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
  if (typeof toolResult === "string") return toolResult;
  if (toolResult != null) return JSON.stringify(toolResult, null, 2);
  return "";
}

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

function Message({ message, onFeedback }) {
  const isUser = message.role === "user";
  const [feedback, setFeedback] = useState(null);
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
      setIsThinkingOpen(true);
      hasAutoOpenedThinkingRef.current = true;
    }
  }, [message.isLoading, toolSteps.length]);

  const handleFeedback = async (rating) => {
    if (onFeedback) {
      const success = await onFeedback(message.id, rating);
      if (success) {
        setFeedback(rating);
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
      }
    }
  };

  return (
    <Flex
      width="100%"
      justify={isUser ? "flex-end" : "flex-start"}
      paddingY="12px"
    >
      <Box
        maxWidth={isUser ? "80%" : "100%"}
        width={isUser ? "fit-content" : "100%"}
        borderRadius="12px"
        padding="16px"
        backgroundColor={isUser ? "#F7F7F7" : "#FFFFFF"}
        color="#000"
      >
        {showThinkingSection && (
          <VStack
            spacing={0}
            align="stretch"
            width="100%"
            marginBottom="24px"
          >
            <Box
              display="flex"
              cursor="pointer"
              gap="20px"
              justifyContent="space-between"
              alignItems="center"
              padding="0 0 16px"
              _hover={{
                opacity: 0.9
              }}
              transition="opacity 0.2s ease"
              onClick={() => setIsThinkingOpen(!isThinkingOpen)}
            >
              <LabelText typography="medium" color="#252A32" fontWeight="500">
                Ver processo de pensamento
              </LabelText>
              <CrossIcon
                alt={isThinkingOpen ? "ocultar processo" : "mostrar processo"}
                color="#252A32"
                transform={!isThinkingOpen && "rotate(45deg)"}
                width="18px"
                height="18px"
                transition="transform 0.2s ease"
              />
            </Box>
            <Collapse in={isThinkingOpen} animateOpacity>
              <VStack spacing="12px" align="stretch" marginTop="16px" width="100%">
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
                      <VStack align="stretch" spacing="12px" width="100%" minW={0}>
                        <BodyText fontWeight="600" color="#374151">
                          Ferramenta:{" "}
                          <CodeBlock inline language="sql">
                            {step.call.name ?? "—"}
                          </CodeBlock>
                        </BodyText>
                        <VStack align="stretch" spacing="4px" width="100%" minW={0}>
                          <BodyText typography="small" fontWeight="600" color="#6B7280">
                            Solicitação:
                          </BodyText>
                          <CodeBlock language="json" marginY="8px">
                            {'streamArgsJson' in step.call
                              ? step.call.streamArgsJson
                              : JSON.stringify(step.call.args, null, 2)}
                          </CodeBlock>
                        </VStack>
                        {step.output ? (
                          <VStack align="stretch" spacing="4px" width="100%" minW={0}>
                            <BodyText typography="small" fontWeight="600" color="#6B7280">
                              Resultado:
                            </BodyText>
                            <CodeBlock language="json" marginY="8px">
                              {formatToolOutputText(step.output)}
                            </CodeBlock>
                          </VStack>
                        ) : null}
                      </VStack>
                    ) : (
                      <VStack align="stretch" spacing="4px" width="100%" minW={0}>
                        <BodyText typography="small" fontWeight="600" color="#6B7280">
                          Resultado:
                        </BodyText>
                        <CodeBlock language="json" marginY="8px">
                          {formatToolOutputText(step.output)}
                        </CodeBlock>
                      </VStack>
                    )}
                  </Box>
                ))}
              </VStack>
            </Collapse>
            <Divider borderColor="#DEDFE0" marginTop="16px"/>
          </VStack>
        )}

        {showPensando && (
          <HStack spacing="12px" align="center" marginBottom="16px" width="100%">
            <Text
              fontFamily="Roboto"
              fontSize="16px"
              fontWeight="500"
              lineHeight="24px"
              animation={`${pensandoTextShimmer} 2s ease-in-out infinite`}
            >
              Pensando...
            </Text>
          </HStack>
        )}

        {isUser ? (
          <BodyText
            whiteSpace="pre-wrap"
          >
            {message.content}
          </BodyText>
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

        {!isUser && !message.isLoading && !message.isTyping && !message.isError && message.id && (
          <HStack spacing="8px" marginTop="8px" justify="flex-end">
            <Box 
              cursor="pointer" 
              onClick={() => handleFeedback(1)}
              pointerEvents={feedback === 1 ? "none" : "auto"}
              opacity={feedback === 1 ? 1 : 0.5}
              _hover={{ opacity: 1 }}
            >
              <ThumbUpIcon />
            </Box>
            <Box  
              cursor="pointer" 
              onClick={() => handleFeedback(0)}
              pointerEvents={feedback === 0 ? "none" : "auto"}
              opacity={feedback === 0 ? 1 : 0.5}
              _hover={{ opacity: 1 }}
            >
              <ThumbDownIcon />
            </Box>
          </HStack>
        )}
      </Box>
    </Flex>
  );
}

export default React.memo(Message);
