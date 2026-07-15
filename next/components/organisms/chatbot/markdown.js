import {
  Box,
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
} from "@chakra-ui/react";
import React, { useMemo } from "react";

import "highlight.js/styles/github.css";
import hljs from "highlight.js/lib/core";
import sql from "highlight.js/lib/languages/sql";
import json from "highlight.js/lib/languages/json";

import BodyText from "../../atoms/Text/BodyText";
import { CopyIcon } from "../../../public/img/icons/copyIcon";
import CheckIcon from "../../../public/img/icons/checkIcon";

hljs.registerLanguage("sql", sql);
hljs.registerLanguage("json", json);

export function CodeBlock({ inline, children, language = "sql", marginY = "24px", raw = false }) {
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

const MAX_TABLE_ROWS = 50;
const TOOL_RESULT_TABLE_MAX_HEIGHT = "70vh";
const LONG_TEXT_THRESHOLD = 100;
const MEDIUM_TEXT_THRESHOLD = 40;
const CELL_MIN_WIDTH_SHORT = "120px";
const CELL_MIN_WIDTH_MEDIUM = "280px";
const CELL_MIN_WIDTH_LONG = "420px";

function getCellMinWidth(textLength) {
  if (textLength >= LONG_TEXT_THRESHOLD) return CELL_MIN_WIDTH_LONG;
  if (textLength >= MEDIUM_TEXT_THRESHOLD) return CELL_MIN_WIDTH_MEDIUM;
  return CELL_MIN_WIDTH_SHORT;
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

function getValueTdProps(value) {
  const text = formatCellValue(value);
  const minW = getCellMinWidth(text.length);

  return {
    ...toolResultTdBaseProps,
    minW,
    width: text.length >= LONG_TEXT_THRESHOLD ? minW : undefined,
  };
}

function getColumnTdProps(records, column) {
  const maxLen = records.reduce((max, row) => {
    const len = formatCellValue(row[column]).length;
    return Math.max(max, len);
  }, column.length);
  const minW = getCellMinWidth(maxLen);

  return {
    ...toolResultTdBaseProps,
    minW,
    width: maxLen >= LONG_TEXT_THRESHOLD ? minW : undefined,
  };
}

const toolResultTableContainerProps = {
  marginY: "8px",
  width: "100%",
  maxWidth: "100%",
  maxHeight: TOOL_RESULT_TABLE_MAX_HEIGHT,
  minH: 0,
  overflowY: "auto",
  overflowX: "auto",
  border: "1px solid #E5E7EB",
  borderRadius: "12px",
};

function ToolResultTableContainer({ children }) {
  return <Box {...toolResultTableContainerProps}>{children}</Box>;
}

function RecordTable({ record }) {
  const entries = Object.entries(record);

  return (
    <ToolResultTableContainer>
      <Table variant="simple" size="sm" width="max-content" minW="100%">
        <Tbody>
          {entries.map(([key, value]) => (
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
              <Td {...getValueTdProps(value)}>
                {formatCellValue(value)}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </ToolResultTableContainer>
  );
}

function RecordsTable({ records }) {
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

  const visibleRows = records.slice(0, MAX_TABLE_ROWS);
  const columnTdPropsByCol = Object.fromEntries(
    columns.map((col) => [col, getColumnTdProps(visibleRows, col)])
  );

  return (
    <Box minH={0} width="100%">
      <ToolResultTableContainer>
        <Table variant="simple" size="sm" width="max-content" minW="100%">
          <Thead backgroundColor="#F7F7F7" position="sticky" top={0} zIndex={1}>
            <Tr>
              {columns.map((col) => (
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
                {columns.map((col) => (
                  <Td key={col} {...columnTdPropsByCol[col]}>
                    {formatCellValue(row[col])}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </ToolResultTableContainer>
      {records.length > MAX_TABLE_ROWS && (
        <Text fontSize="12px" color="#6B7280" marginTop="4px">
          Mostrando {MAX_TABLE_ROWS} de {records.length} resultados
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

  if (isRecordsArray) {
    return <RecordsTable records={parsed} />;
  }

  if (isSingleRecord) {
    return <RecordTable record={parsed} />;
  }

  const text = formatToolOutputText(output);
  if (!text) return null;

  return (
    <MemoCodeBlock language="json" marginY="8px" raw={Boolean(output?.streaming)}>
      {text}
    </MemoCodeBlock>
  );
}
