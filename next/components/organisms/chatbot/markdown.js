import {
  Box,
  Flex,
  Text,
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
  Tooltip,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";

import "highlight.js/styles/github.css";
import hljs from "highlight.js/lib/core";
import sql from "highlight.js/lib/languages/sql";
import json from "highlight.js/lib/languages/json";

import BodyText from "../../atoms/Text/BodyText";
import { CopyIcon } from "../../../public/img/icons/copyIcon";
import AnimatedCopyIcon from "../../atoms/AnimatedCopyIcon";
import { DownloadResultButton } from "./DownloadResults";

hljs.registerLanguage("sql", sql);
hljs.registerLanguage("json", json);

const ActionTooltipProps = {
  hasArrow: true,
  backgroundColor: "#252A32",
  borderRadius: "8px",
  letterSpacing: "0.1px",
  lineHeight: "18px",
  fontWeight: "400",
  fontSize: "12px",
  fontFamily: "Roboto",
  color: "#FFFFFF",
  padding: "8px 12px",
  boxShadow: "0 2px 16px rgba(0, 0, 0, 0.16)",
  placement: "top-start",
};

export function CodeBlock({
  inline,
  children,
  language = "sql",
  marginY = "24px",
  raw = false,
  downloadProps = null,
  title = null,
}) {
  const code = String(children).replace(/\n$/, "");
  const { hasCopied, onCopy } = useClipboard(code);
  const hasHeader = title != null;

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

  const actionButtons = (
    <Flex alignItems="center" gap="8px" flexShrink={0}>
      <Tooltip
        {...ActionTooltipProps}
        label={hasCopied ? "Copiado!" : "Copiar"}
      >
        <Box
          cursor="pointer"
          display="flex"
          alignItems="center"
          width="16px"
          height="16px"
          fill="#252A32"
          onClick={onCopy}
          backgroundColor="transparent"
        >
          <AnimatedCopyIcon copied={hasCopied} icon={CopyIcon} width="16px" height="16px" />
        </Box>
      </Tooltip>
      {downloadProps && <DownloadResultButton {...downloadProps} />}
    </Flex>
  );

  return (
    <Box
      position="relative"
      marginY={marginY}
      borderRadius="12px"
      backgroundColor="#F9FAFB"
      overflow="hidden"
      border="1px solid #E5E7EB"
      width="100%"
      maxWidth="100%"
      minWidth={0}
      alignSelf="stretch"
    >
      {hasHeader ? (
        <Flex
          alignItems="center"
          justifyContent="space-between"
          gap="12px"
          padding="12px 16px"
          backgroundColor="#F7F7F7"
          borderBottom="1px solid #E5E7EB"
          minWidth={0}
        >
          <BodyText
            typography="small"
            fontWeight="500"
            color="#252A32"
            noOfLines={1}
            minWidth={0}
          >
            {title}
          </BodyText>
          {actionButtons}
        </Flex>
      ) : (
        <Flex
          position="absolute"
          top="12px"
          right="12px"
          alignItems="center"
          gap="8px"
          zIndex="1"
        >
          {actionButtons}
        </Flex>
      )}

      <Box
        as="pre"
        display="block"
        width="100%"
        maxWidth="100%"
        minWidth={0}
        maxHeight="70vh"
        overflow="auto"
        fontSize="14px"
        backgroundColor="#F9FAFB"
        margin={0}
        padding={
          hasHeader
            ? "0"
            : downloadProps
              ? "12px 64px 12px 12px"
              : "12px 40px 12px 12px"
        }
        boxSizing="border-box"
      >
        {raw ? (
          <Box
            as="code"
            display="block"
            width="max-content"
            minWidth="100%"
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
            minWidth="100%"
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

export const MemoCodeBlock = React.memo(CodeBlock);

export const componentsMk = {
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

export function formatToolOutputText(output) {
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

function parseToolOutputValue(output) {
  if (!output || output.streaming) return null;
  const toolResult = output.content ?? output.output ?? output.result;
  if (toolResult == null) return null;
  if (typeof toolResult !== "string") return toolResult;
  const trimmed = toolResult.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function formatCellValue(value) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

const MaxTableRows = 50;
const ToolResultTableMaxHeight = "70vh";
const ToolResultCellMaxChars = 120;
const LongTextThreshold = 100;
const MediumTextThreshold = 40;
const CellMinWidthShort = "120px";
const CellMinWidthMedium = "280px";
const CellMinWidthLong = "420px";

function getDisplayTextLength(text, truncateMaxChars) {
  if (!truncateMaxChars || text.length <= truncateMaxChars) return text.length;
  return truncateMaxChars + 12;
}

function orderEntriesWithIdLast(entries, moveIdToEnd) {
  if (!moveIdToEnd) return entries;
  const rest = [];
  let idEntry = null;
  for (const entry of entries) {
    if (entry[0] === "id") idEntry = entry;
    else rest.push(entry);
  }
  if (idEntry) rest.push(idEntry);
  return rest;
}

function orderColumnsWithIdLast(columns, moveIdToEnd) {
  if (!moveIdToEnd || !columns.includes("id")) return columns;
  return [...columns.filter((col) => col !== "id"), "id"];
}

function TruncatableCellContent({ text, maxChars }) {
  const [expanded, setExpanded] = useState(false);

  if (!maxChars || text.length <= maxChars) {
    return text;
  }

  if (expanded) {
    return (
      <>
        {text}{" "}
        <Text
          as="button"
          type="button"
          display="inline"
          fontFamily="inherit"
          fontSize="inherit"
          lineHeight="inherit"
          color="#0068C5"
          fontWeight="500"
          background="transparent"
          border="none"
          padding={0}
          cursor="pointer"
          _hover={{ textDecoration: "underline" }}
          onClick={() => setExpanded(false)}
        >
          ver menos
        </Text>
      </>
    );
  }

  return (
    <>
      {text.slice(0, maxChars).trimEnd()}…{" "}
      <Text
        as="button"
        type="button"
        display="inline"
        fontFamily="inherit"
        fontSize="inherit"
        lineHeight="inherit"
        color="#0068C5"
        fontWeight="500"
        background="transparent"
        border="none"
        padding={0}
        cursor="pointer"
        _hover={{ textDecoration: "underline" }}
        onClick={() => setExpanded(true)}
      >
        ver mais
      </Text>
    </>
  );
}

function getCellMinWidth(textLength) {
  if (textLength >= LongTextThreshold) return CellMinWidthLong;
  if (textLength >= MediumTextThreshold) return CellMinWidthMedium;
  return CellMinWidthShort;
}

const toolResultTdBaseProps = {
  padding: "10px 16px",
  fontFamily: "Roboto",
  fontWeight: "400",
  fontSize: "13px",
  lineHeight: "18px",
  color: "#464A51",
  borderColor: "#DEDFE0",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  verticalAlign: "top",
};

function getValueTdProps(value, truncateMaxChars) {
  const text = formatCellValue(value);
  const displayLen = getDisplayTextLength(text, truncateMaxChars);
  const minWidth = getCellMinWidth(displayLen);

  return {
    ...toolResultTdBaseProps,
    minWidth,
    width: displayLen >= LongTextThreshold ? minWidth : undefined,
  };
}

function getColumnTdProps(records, column, truncateMaxChars) {
  const maxLen = records.reduce((max, row) => {
    const text = formatCellValue(row[column]);
    const len = getDisplayTextLength(text, truncateMaxChars);
    return Math.max(max, len);
  }, column.length);
  const minWidth = getCellMinWidth(maxLen);

  return {
    ...toolResultTdBaseProps,
    minWidth,
    width: maxLen >= LongTextThreshold ? minWidth : undefined,
  };
}

const toolResultTableContainerProps = {
  width: "100%",
  maxWidth: "100%",
  maxHeight: ToolResultTableMaxHeight,
  minHeight: 0,
  overflowY: "auto",
  overflowX: "auto",
  border: "1px solid #E5E7EB",
  borderRadius: "12px",
};

function ToolResultTableContainer({ children }) {
  return <Box {...toolResultTableContainerProps}>{children}</Box>;
}

export function RecordTable({
  record,
  moveIdToEnd = false,
  truncateCellMaxChars,
}) {
  const entries = orderEntriesWithIdLast(
    Object.entries(record),
    moveIdToEnd
  );

  return (
    <ToolResultTableContainer>
      <Table variant="simple" size="sm" width="max-content" minWidth="100%">
        <Tbody>
          {entries.map(([key, value]) => {
            const cellText = formatCellValue(value);
            return (
              <Tr key={key}>
                <Th
                  padding="10px 16px"
                  textTransform="none"
                  letterSpacing="inherit"
                  fontFamily="Roboto"
                  fontWeight="600"
                  fontSize="13px"
                  lineHeight="18px"
                  color="#252A32"
                  backgroundColor="#F7F7F7"
                  borderColor="#DEDFE0"
                  whiteSpace="nowrap"
                >
                  {key}
                </Th>
                <Td {...getValueTdProps(value, truncateCellMaxChars)}>
                  <TruncatableCellContent
                    text={cellText}
                    maxChars={truncateCellMaxChars}
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </ToolResultTableContainer>
  );
}

function RecordsTable({
  records,
  moveIdToEnd = false,
  truncateCellMaxChars,
}) {
  const columns = [];
  const seen = new Set();
  for (const row of records) {
    for (const key of Object.keys(row)) {
      if (!seen.has(key)) {
        seen.add(key);
        columns.push(key);
      }
    }
  }
  const orderedColumns = orderColumnsWithIdLast(columns, moveIdToEnd);

  const visibleRows = records.slice(0, MaxTableRows);
  const columnTdPropsByCol = Object.fromEntries(
    orderedColumns.map((col) => [
      col,
      getColumnTdProps(visibleRows, col, truncateCellMaxChars),
    ])
  );

  return (
    <Box minHeight={0} width="100%">
      <ToolResultTableContainer>
        <Table variant="simple" size="sm" width="max-content" minWidth="100%">
          <Thead backgroundColor="#F7F7F7" position="sticky" top={0} zIndex={1}>
            <Tr>
              {orderedColumns.map((col) => (
                <Th
                  key={col}
                  padding="10px 16px"
                  textTransform="none"
                  letterSpacing="inherit"
                  fontFamily="Roboto"
                  fontWeight="600"
                  fontSize="13px"
                  lineHeight="18px"
                  color="#252A32"
                  borderColor="#DEDFE0"
                  whiteSpace="nowrap"
                >
                  {col}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {visibleRows.map((row, index) => (
              <Tr key={index}>
                {orderedColumns.map((col) => {
                  const cellText = formatCellValue(row[col]);
                  return (
                    <Td key={col} {...columnTdPropsByCol[col]}>
                      <TruncatableCellContent
                        text={cellText}
                        maxChars={truncateCellMaxChars}
                      />
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </ToolResultTableContainer>
      {records.length > MaxTableRows && (
        <Text fontSize="12px" color="#71757A" marginTop="4px">
          Mostrando {MaxTableRows} de {records.length} resultados
        </Text>
      )}
    </Box>
  );
}

export function ToolResultView({ output }) {
  const parsed = useMemo(() => parseToolOutputValue(output), [output]);

  const isRecordsArray =
    Array.isArray(parsed) && parsed.length > 0 && parsed.every(isPlainObject);
  const isSingleRecord = isPlainObject(parsed) && Object.keys(parsed).length > 0;

  const resultTableProps = {
    moveIdToEnd: true,
    truncateCellMaxChars: ToolResultCellMaxChars,
  };

  if (isRecordsArray) {
    return <RecordsTable records={parsed} {...resultTableProps} />;
  }

  if (isSingleRecord) {
    return <RecordTable record={parsed} {...resultTableProps} />;
  }

  const text = formatToolOutputText(output);
  if (!text) return null;

  return (
    <MemoCodeBlock language="json" raw={Boolean(output?.streaming)}>
      {text}
    </MemoCodeBlock>
  );
}
