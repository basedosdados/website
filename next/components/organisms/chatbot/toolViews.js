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

// Friendlier, per-tool renderings of a tool's request args and JSON output — a
// dataset list, a table schema, a result table, and so on — so the request and
// result blocks read as structured information instead of a raw JSON dump. Each
// parser is pure and returns null when the payload doesn't match its expected
// shape; the caller then falls back to the generic table / JSON rendering, so an
// unexpected shape never regresses to worse than today.
//
// Shapes follow the backend models in app/agent/tools/models.py: datasets carry
// a human `name` and `organizations`, tables a `name` and coverage
// (`period_start`/`period_end`), columns a `unit`. We surface names in place of
// the raw ids.

// ============================== Payload helpers ==============================

// search_datasets / decode_table_values return a bare JSON array; the *_details
// tools return a bare object; an error path may return a `{ status: "error" }`
// envelope. Unwrap `results` when present, bow out on an error envelope, and
// pass a bare value through unchanged.
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

// A truncated list can end with a "... (N more items)" sentinel string; split it
// off as a numeric `more` so it renders as a "+N" note instead of a row.
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

// The display name, preferring the human `name` and falling back to the id.
function pickName(o, fallback) {
  return nonEmptyString(o.name) || fallback;
}

function stringList(value) {
  return Array.isArray(value) ? value.filter((s) => typeof s === "string" && s.trim()) : [];
}

// A column's description with its unit appended — "description (unit)".
function columnDescription(c) {
  const desc = nonEmptyString(c.description);
  const unit = nonEmptyString(c.unit);
  if (desc && unit) return `${desc} (${unit})`;
  if (desc) return desc;
  if (unit) return `(${unit})`;
  return null;
}

// A "start – end" coverage label from the table's period bounds.
function coveragePeriod(start, end) {
  const s = nonEmptyString(start);
  const e = nonEmptyString(end);
  if (s && e) return s === e ? s : `${s} – ${e}`;
  return s || e || null;
}

// The dataset/table part of a fully-qualified id (drops the project prefix).
function cleanTableRef(raw) {
  const cleaned = raw.replace(/`/g, "").trim();
  return cleaned.split(".").slice(-2).join(".") || cleaned;
}

// Rounded, inset scrollbars for the result table's scroll container, so the
// bars don't read as square rails that collide in the bottom-right corner. The
// transparent border + padding-box clip keeps the thumb slim and off the edges.
const scrollbarSx = {
  // Intentionally NOT setting the standard `scrollbar-width`/`scrollbar-color`:
  // once either is present, Chromium renders the native scrollbar and ignores
  // the `::-webkit-scrollbar-*` rules below — which brings back the OS arrow
  // buttons we hide via `scrollbar-button`. Relying on the webkit pseudo-elements
  // keeps arrowless scrollbars in Chrome; Firefox's default thin bars have no arrows.
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

// ============================== Parsers ==============================

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

// execute_bigquery_sql returns `{ row_count, rows, query_ref }`. The `rows` list
// may carry the "... (N more items)" sentinel; the real "+N" is row_count (total
// matched) minus the rows actually shown.
function parseBigquerySqlResult(content) {
  const results = unwrapResults(content);
  if (!isPlainObject(results) || !Array.isArray(results.rows)) return null;
  const { items } = splitTruncation(results.rows);
  const rows = [];
  for (const it of items) {
    if (!isPlainObject(it)) return null;
    rows.push(it);
  }
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
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
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  return { columns, rows, more };
}

// ============================== Shared UI ==============================

// Renders a locale-aware count label ("5 linhas") with the number grouped for
// the active language and the noun pluralized on `count`.
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

// ============================== Output views ==============================

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

// ============================== Request views ==============================

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

// ============================== Entry points ==============================

// A friendly view of a tool's request args, or null to fall back to the generic
// args rendering. execute_bigquery_sql is intentionally left out — the caller
// renders its SQL in a code block with a download action.
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
    default:
      return null;
  }
}

// A friendly view for the tool's output, or null when the payload doesn't match
// (caller falls back to the generic rendering). Never renders while the output
// is still streaming — the JSON is only partial then.
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
    default:
      return null;
  }
}
