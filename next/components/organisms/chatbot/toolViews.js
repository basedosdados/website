import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "next-i18next";

function unwrapResults(content) {
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    return undefined;
  }
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    if (parsed.status === "error") return undefined;
    if ("results" in parsed) return parsed.results;
  }
  return parsed;
}

const MORE_ITEMS_RE = /^\.\.\. \((\d+) more items\)$/;

function splitTruncation(arr) {
  const last = arr[arr.length - 1];
  if (typeof last === "string") {
    const m = MORE_ITEMS_RE.exec(last);
    if (m) return { items: arr.slice(0, -1), more: Number(m[1]) };
  }
  return { items: arr, more: 0 };
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function pickName(o, fallback) {
  return nonEmptyString(o.name) || fallback;
}

function stringList(value) {
  return Array.isArray(value) ? value.filter((s) => typeof s === "string" && s.trim()) : [];
}

function columnDescription(c) {
  const desc = nonEmptyString(c.description);
  const unit = nonEmptyString(c.unit);
  if (desc && unit) return `${desc} (${unit})`;
  if (desc) return desc;
  if (unit) return `(${unit})`;
  return null;
}

function coveragePeriod(start, end) {
  const s = nonEmptyString(start);
  const e = nonEmptyString(end);
  if (s && e) return s === e ? s : `${s} – ${e}`;
  return s || e || null;
}

function cleanTableRef(raw) {
  const cleaned = raw.replace(/`/g, "").trim();
  return cleaned.split(".").slice(-2).join(".") || cleaned;
}

const scrollbarSx = {
  "&::-webkit-scrollbar": { width: "12px", height: "12px" },
  "&::-webkit-scrollbar-button": { display: "none", width: 0, height: 0 },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  "&::-webkit-scrollbar-corner": { background: "transparent" },
  "&::-webkit-scrollbar-thumb": {
    background: "#DEDFE0",
    borderRadius: "9999px",
    border: "3px solid transparent",
    backgroundClip: "padding-box",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#ACAEB1",
    borderRadius: "9999px",
    border: "3px solid transparent",
    backgroundClip: "padding-box",
  },
};

function formatCell(v) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function formatBytes(bytes) {
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes < 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 100 ? 0 : 1)} ${units[unitIndex]}`;
}

function columnIsNumeric(rows, col) {
  let sawValue = false;
  for (const row of rows) {
    const v = row[col];
    if (v === null || v === undefined) continue;
    if (typeof v !== "number") return false;
    sawValue = true;
  }
  return sawValue;
}

function unionColumns(rows) {
  const seen = new Set();
  const columns = [];
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!seen.has(key)) {
        seen.add(key);
        columns.push(key);
      }
    }
  }
  return columns;
}


function parseDatasetList(content) {
  const results = unwrapResults(content);
  if (!Array.isArray(results) || results.length === 0) return null;
  const { items, more } = splitTruncation(results);
  const datasets = [];
  for (const item of items) {
    if (!isPlainObject(item)) return null;
    const id = nonEmptyString(item.id);
    const name = pickName(item, id);
    if (!name) return null;
    datasets.push({
      name,
      description: nonEmptyString(item.description),
      organizations: stringList(item.organizations),
    });
  }
  return datasets.length > 0 ? { datasets, more } : null;
}

function parseDatasetDetail(content) {
  const results = unwrapResults(content);
  if (!isPlainObject(results)) return null;
  const id = nonEmptyString(results.id);
  const name = pickName(results, id);
  if (!name || !Array.isArray(results.tables)) return null;
  const { items, more: tablesMore } = splitTruncation(results.tables);
  const tables = [];
  for (const t of items) {
    if (!isPlainObject(t)) return null;
    const tableName = pickName(t, nonEmptyString(t.id));
    if (!tableName) return null;
    tables.push({ name: tableName, description: nonEmptyString(t.description) });
  }
  return {
    name,
    description: nonEmptyString(results.description),
    organizations: stringList(results.organizations),
    tables,
    tablesMore,
  };
}

function parseTableDetail(content) {
  const results = unwrapResults(content);
  if (!isPlainObject(results)) return null;
  const id = nonEmptyString(results.id);
  const name = pickName(results, id);
  if (!name || !Array.isArray(results.columns)) return null;
  const { items, more: columnsMore } = splitTruncation(results.columns);
  const columns = [];
  for (const c of items) {
    if (!isPlainObject(c) || typeof c.name !== "string") return null;
    columns.push({
      name: c.name,
      type: typeof c.type === "string" ? c.type : "",
      description: columnDescription(c),
    });
  }
  return {
    name,
    description: nonEmptyString(results.description),
    coverage: coveragePeriod(results.period_start, results.period_end),
    columns,
    columnsMore,
  };
}

function parseBigquerySqlResult(content) {
  const results = unwrapResults(content);
  if (!isPlainObject(results) || !Array.isArray(results.rows)) return null;
  const { items } = splitTruncation(results.rows);
  const rows = [];
  for (const it of items) {
    if (!isPlainObject(it)) return null;
    rows.push(it);
  }
  const columns = unionColumns(rows);
  const rowCount = typeof results.row_count === "number" ? results.row_count : rows.length;
  const more = Math.max(0, rowCount - rows.length);
  return { columns, rows, more };
}

function parseRowTable(content) {
  const results = unwrapResults(content);
  if (!Array.isArray(results)) return null;
  const { items, more } = splitTruncation(results);
  const rows = [];
  for (const it of items) {
    if (!isPlainObject(it)) return null;
    rows.push(it);
  }
  const columns = unionColumns(rows);
  return { columns, rows, more };
}

function parseQueryResultsList(content) {
  const results = unwrapResults(content);
  if (!Array.isArray(results)) return null;
  const { items, more } = splitTruncation(results);
  const entries = [];
  for (const item of items) {
    if (!isPlainObject(item)) return null;
    const description = nonEmptyString(item.description) || nonEmptyString(item.query_ref);
    if (!description) return null;
    entries.push({ description, expired: item.expired === true });
  }
  return { entries, more };
}

function parseExportResult(content) {
  const results = unwrapResults(content);
  if (!isPlainObject(results)) return null;
  const filename = nonEmptyString(results.filename);
  const format = nonEmptyString(results.format);
  const size = formatBytes(results.size_bytes);
  if (!filename && !format && !size) return null;
  return { filename, format, size };
}

function parseChartResult(content) {
  const results = unwrapResults(content);
  if (!isPlainObject(results)) return null;
  const rowCount = typeof results.row_count === "number" ? results.row_count : null;
  if (rowCount === null) return null;
  return { rowCount };
}


function useCountLabel() {
  const { t, i18n } = useTranslation("chatbot");
  const nf = useMemo(
    () => new Intl.NumberFormat(i18n?.language || "pt-BR"),
    [i18n?.language]
  );
  return useCallback(
    (nounKey, n) =>
      t(`ui.thinking.views.${nounKey}`, { count: n, formatted: nf.format(n) }),
    [t, nf]
  );
}

function Eyebrow({ children }) {
  return (
    <Box
      fontFamily="Roboto"
      fontSize="11px"
      fontWeight="500"
      textTransform="uppercase"
      letterSpacing="0.05em"
      lineHeight="16px"
      color="#71757A"
    >
      {children}
    </Box>
  );
}

function EntityName({ children }) {
  return (
    <Text noOfLines={2} fontFamily="Roboto" fontSize="14px" fontWeight="500" color="#252A32">
      {children}
    </Text>
  );
}

function MutedText({ children, noOfLines }) {
  return (
    <Text noOfLines={noOfLines} fontFamily="Roboto" fontSize="13px" color="#71757A">
      {children}
    </Text>
  );
}

function OrgLine({ organizations }) {
  if (!organizations || organizations.length === 0) return null;
  return (
    <Text fontFamily="Roboto" fontSize="12px" color="#71757A">
      {organizations.join(", ")}
    </Text>
  );
}

function MoreNote({ count, nounKey }) {
  const label = useCountLabel();
  if (count <= 0) return null;
  return (
    <Text fontFamily="Roboto" fontSize="13px" color="#71757A">
      + {label(nounKey, count)}
    </Text>
  );
}

function LabeledValue({ label, value, mono = false }) {
  return (
    <Flex gap="8px" align="baseline" minWidth={0}>
      <Box as="span" flexShrink={0} fontFamily="Roboto" fontSize="13px" color="#71757A">
        {label}
      </Box>
      <Text
        noOfLines={1}
        minWidth={0}
        fontFamily={mono ? "ui-monospace, monospace" : "Roboto"}
        fontSize="13px"
        fontWeight="500"
        color="#464A51"
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </Text>
    </Flex>
  );
}

function TypeBadge({ children }) {
  return (
    <Box
      as="span"
      flexShrink={0}
      borderRadius="4px"
      backgroundColor="#EEEEEE"
      padding="1px 4px"
      fontFamily="Roboto"
      fontSize="9px"
      fontWeight="500"
      textTransform="uppercase"
      letterSpacing="0.03em"
      color="#71757A"
    >
      {children}
    </Box>
  );
}


function DatasetList({ datasets, more }) {
  const label = useCountLabel();
  const total = datasets.length + more;
  return (
    <VStack align="stretch" spacing="8px">
      <Eyebrow>{label("datasets", total)}</Eyebrow>
      <VStack as="ul" align="stretch" spacing="10px" listStyleType="none" margin={0}>
        {datasets.map((d, i) => (
          <Box as="li" key={i} minWidth={0}>
            <EntityName>{d.name}</EntityName>
            <OrgLine organizations={d.organizations} />
            {d.description && <MutedText noOfLines={2}>{d.description}</MutedText>}
          </Box>
        ))}
      </VStack>
      <MoreNote count={more} nounKey="datasets" />
    </VStack>
  );
}

function DatasetDetails({ dataset }) {
  const label = useCountLabel();
  const totalTables = dataset.tables.length + dataset.tablesMore;
  return (
    <VStack align="stretch" spacing="8px">
      <Box minWidth={0}>
        <EntityName>{dataset.name}</EntityName>
        <OrgLine organizations={dataset.organizations} />
      </Box>
      {dataset.description && <MutedText>{dataset.description}</MutedText>}
      <Eyebrow>{label("tables", totalTables)}</Eyebrow>
      <VStack as="ul" align="stretch" spacing="6px" listStyleType="none" margin={0}>
        {dataset.tables.map((tb, i) => (
          <Box as="li" key={i} minWidth={0}>
            <Text noOfLines={1} fontFamily="Roboto" fontSize="13px" fontWeight="500" color="#464A51">
              {tb.name}
            </Text>
            {tb.description && <MutedText noOfLines={2}>{tb.description}</MutedText>}
          </Box>
        ))}
      </VStack>
      <MoreNote count={dataset.tablesMore} nounKey="tables" />
    </VStack>
  );
}

function ColumnList({ columns, columnsMore }) {
  return (
    <VStack as="ul" align="stretch" spacing="4px" listStyleType="none" margin={0}>
      {columns.map((c, i) => (
        <Flex as="li" key={i} align="center" gap="6px" minWidth={0}>
          <Text
            as="span"
            flexShrink={0}
            fontFamily="ui-monospace, monospace"
            fontSize="12px"
            color="#464A51"
          >
            {c.name}
          </Text>
          {c.type && <TypeBadge>{c.type}</TypeBadge>}
          {c.description && (
            <Text noOfLines={1} fontFamily="Roboto" fontSize="13px" color="#71757A" minWidth={0}>
              {c.description}
            </Text>
          )}
        </Flex>
      ))}
      <MoreNote count={columnsMore} nounKey="columns" />
    </VStack>
  );
}

function TableDetails({ table }) {
  const { t } = useTranslation("chatbot");
  const label = useCountLabel();
  const totalCols = table.columns.length + table.columnsMore;
  return (
    <VStack align="stretch" spacing="8px">
      <EntityName>{table.name}</EntityName>
      {table.description && <MutedText>{table.description}</MutedText>}
      {table.coverage && (
        <>
          <Eyebrow>{t("ui.thinking.views.coverage")}</Eyebrow>
          <Text
            fontFamily="Roboto"
            fontSize="13px"
            fontWeight="400"
            color="#464A51"
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            {table.coverage}
          </Text>
        </>
      )}
      <Eyebrow>{label("columns", totalCols)}</Eyebrow>
      <ColumnList columns={table.columns} columnsMore={table.columnsMore} />
    </VStack>
  );
}

function RowTable({ columns, rows, more }) {
  const { t } = useTranslation("chatbot");
  const label = useCountLabel();
  const numeric = useMemo(
    () => new Set(columns.filter((c) => columnIsNumeric(rows, c))),
    [columns, rows]
  );

  if (rows.length === 0) {
    return (
      <Text fontFamily="Roboto" fontSize="13px" color="#71757A">
        {t("ui.thinking.views.emptyRows")}
      </Text>
    );
  }

  const total = rows.length + more;
  return (
    <VStack align="stretch" spacing="8px">
      <Eyebrow>{label("rows", total)}</Eyebrow>
      <Box
        width="100%"
        maxHeight="260px"
        overflow="auto"
        border="1px solid #E5E7EB"
        borderRadius="12px"
        sx={scrollbarSx}
      >
        <Table
          variant="unstyled"
          size="sm"
          width="max-content"
          minWidth="100%"
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          <Thead position="sticky" top={0} zIndex={1} backgroundColor="#F7F7F7">
            <Tr>
              {columns.map((c) => (
                <Th
                  key={c}
                  whiteSpace="nowrap"
                  padding="8px 12px"
                  borderBottom="1px solid #E5E7EB"
                  fontFamily="ui-monospace, monospace"
                  fontWeight="500"
                  fontSize="13px"
                  textTransform="none"
                  letterSpacing="0"
                  color="#71757A"
                  textAlign={numeric.has(c) ? "right" : "left"}
                >
                  {c}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row, i) => (
              <Tr
                key={i}
                sx={{ "&:not(:last-of-type) td": { borderBottom: "1px solid #EEEEEE" } }}
              >
                {columns.map((c) => (
                  <Td
                    key={c}
                    padding="8px 12px"
                    verticalAlign="top"
                    fontFamily="Roboto"
                    fontSize="13px"
                    color="#464A51"
                    textAlign={numeric.has(c) ? "right" : "left"}
                  >
                    <Box
                      maxWidth="320px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {formatCell(row[c])}
                    </Box>
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <MoreNote count={more} nounKey="rows" />
    </VStack>
  );
}


function QueryText({ children }) {
  return (
    <Text
      fontFamily="Roboto"
      fontSize="13px"
      color="#464A51"
      whiteSpace="pre-wrap"
      wordBreak="break-word"
    >
      {children}
    </Text>
  );
}

function RequestPairs({ pairs }) {
  const { t } = useTranslation("chatbot");
  return (
    <VStack align="stretch" spacing="6px">
      {pairs.map(([key, value]) => (
        <LabeledValue key={key} label={t(`ui.thinking.views.req.${key}`)} value={value} mono />
      ))}
    </VStack>
  );
}

function ResultPairs({ pairs }) {
  const { t } = useTranslation("chatbot");
  return (
    <VStack align="stretch" spacing="6px">
      {pairs.map(([key, value]) => (
        <LabeledValue key={key} label={t(`ui.thinking.views.res.${key}`)} value={value} mono />
      ))}
    </VStack>
  );
}

function QueryResultsList({ entries, more }) {
  const { t } = useTranslation("chatbot");
  const label = useCountLabel();
  if (entries.length === 0) {
    return (
      <Text fontFamily="Roboto" fontSize="13px" color="#71757A">
        {t("ui.thinking.views.emptyResults")}
      </Text>
    );
  }
  const total = entries.length + more;
  return (
    <VStack align="stretch" spacing="8px">
      <Eyebrow>{label("results", total)}</Eyebrow>
      <VStack as="ul" align="stretch" spacing="6px" listStyleType="none" margin={0}>
        {entries.map((e, i) => (
          <Flex as="li" key={i} align="center" gap="6px" minWidth={0}>
            <Text
              noOfLines={1}
              minWidth={0}
              fontFamily="Roboto"
              fontSize="13px"
              fontWeight="500"
              color="#464A51"
            >
              {e.description}
            </Text>
            {e.expired && <TypeBadge>{t("ui.thinking.views.expired")}</TypeBadge>}
          </Flex>
        ))}
      </VStack>
      <MoreNote count={more} nounKey="results" />
    </VStack>
  );
}

function ExportResult({ filename, format, size }) {
  const pairs = [];
  if (filename) pairs.push(["filename", filename]);
  if (format) pairs.push(["format", format.toUpperCase()]);
  if (size) pairs.push(["size", size]);
  return <ResultPairs pairs={pairs} />;
}

function ChartResult({ rowCount }) {
  const { t } = useTranslation("chatbot");
  const label = useCountLabel();
  return (
    <VStack align="stretch" spacing="6px">
      <Eyebrow>{t("ui.thinking.views.chartRendered")}</Eyebrow>
      <MutedText>{label("points", rowCount)}</MutedText>
    </VStack>
  );
}


export function renderFriendlyRequest(name, args) {
  if (!isPlainObject(args)) return null;

  switch (name) {
    case "search_datasets": {
      const query = nonEmptyString(args.query);
      return query ? <QueryText>{query}</QueryText> : null;
    }
    case "get_dataset_details": {
      const id = nonEmptyString(args.dataset_id);
      return id ? <RequestPairs pairs={[["dataset", id]]} /> : null;
    }
    case "get_table_details": {
      const id = nonEmptyString(args.table_id);
      return id ? <RequestPairs pairs={[["table", cleanTableRef(id)]]} /> : null;
    }
    case "decode_table_values": {
      const raw = nonEmptyString(args.table_gcp_id);
      const table = raw ? cleanTableRef(raw) : null;
      const column = nonEmptyString(args.column_name);
      if (!table && !column) return null;
      const pairs = [];
      if (table) pairs.push(["table", table]);
      if (column) pairs.push(["column", column]);
      return <RequestPairs pairs={pairs} />;
    }
    case "export_query_result": {
      const format = nonEmptyString(args.file_format);
      return format ? <RequestPairs pairs={[["format", format.toUpperCase()]]} /> : null;
    }
    case "chart_query_result": {
      const instructions = nonEmptyString(args.instructions);
      return instructions ? <QueryText>{instructions}</QueryText> : null;
    }
    default:
      return null;
  }
}

export function renderFriendlyOutput(name, output) {
  if (!output || output.streaming) return null;
  const raw = output.content ?? output.output ?? output.result;
  if (typeof raw !== "string") return null;
  const content = raw;

  switch (name) {
    case "search_datasets": {
      const parsed = parseDatasetList(content);
      return parsed ? <DatasetList datasets={parsed.datasets} more={parsed.more} /> : null;
    }
    case "get_dataset_details": {
      const dataset = parseDatasetDetail(content);
      return dataset ? <DatasetDetails dataset={dataset} /> : null;
    }
    case "get_table_details": {
      const table = parseTableDetail(content);
      return table ? <TableDetails table={table} /> : null;
    }
    case "execute_bigquery_sql": {
      const table = parseBigquerySqlResult(content);
      return table ? (
        <RowTable columns={table.columns} rows={table.rows} more={table.more} />
      ) : null;
    }
    case "decode_table_values": {
      const table = parseRowTable(content);
      return table ? (
        <RowTable columns={table.columns} rows={table.rows} more={table.more} />
      ) : null;
    }
    case "list_query_results": {
      const parsed = parseQueryResultsList(content);
      return parsed ? <QueryResultsList entries={parsed.entries} more={parsed.more} /> : null;
    }
    case "export_query_result": {
      const parsed = parseExportResult(content);
      return parsed ? <ExportResult {...parsed} /> : null;
    }
    case "chart_query_result": {
      const parsed = parseChartResult(content);
      return parsed ? <ChartResult rowCount={parsed.rowCount} /> : null;
    }
    default:
      return null;
  }
}
