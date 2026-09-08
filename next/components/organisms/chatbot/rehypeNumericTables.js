// Ported from the reference: decides table alignment per COLUMN, not per cell.
// A column whose body cells are all numeric (empties ignored) gets
// `data-numeric` on every cell — header included — so the title and its values
// always right-align together. Columns the author aligned explicitly in GFM
// (`:---` / `---:`) are left untouched (remark-gfm already set those).

function textOf(node) {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

// "5,84", "5.5", "41%", "R$ 1.200", "-0,3" — digits plus numeric punctuation and
// currency only. Anything with prose ("0,34 ponto") stays left-aligned.
const NUMERIC_RE = /^[\s%+\-–—.,()R$\d]*\d[\s%+\-–—.,()R$\d]*$/;

function isElement(node, tag) {
  return node.type === "element" && node.tagName === tag;
}

function rows(section) {
  return (section.children ?? []).filter((c) => isElement(c, "tr"));
}

function cells(row) {
  return (row.children ?? []).filter(
    (c) => isElement(c, "td") || isElement(c, "th")
  );
}

export default function rehypeNumericTables() {
  function processTable(table) {
    const sections = table.children ?? [];
    const thead = sections.find((c) => isElement(c, "thead"));
    const tbodies = sections.filter((c) => isElement(c, "tbody"));
    const bodyRows = tbodies.flatMap(rows);
    if (bodyRows.length === 0) return;

    const columnCount = Math.max(...bodyRows.map((r) => cells(r).length));
    for (let col = 0; col < columnCount; col++) {
      let sawValue = false;
      let allNumeric = true;
      let explicitlyAligned = false;
      for (const row of bodyRows) {
        const cell = cells(row)[col];
        if (!cell) continue;
        if (cell.properties?.align != null || cell.properties?.style != null) {
          explicitlyAligned = true;
          break;
        }
        const text = textOf(cell).trim();
        if (!text) continue;
        sawValue = true;
        if (!NUMERIC_RE.test(text)) {
          allNumeric = false;
          break;
        }
      }
      if (explicitlyAligned || !sawValue || !allNumeric) continue;

      const columnCells = [...(thead ? rows(thead) : []), ...bodyRows].flatMap(
        (row) => {
          const cell = cells(row)[col];
          return cell ? [cell] : [];
        }
      );
      for (const cell of columnCells) {
        cell.properties = { ...cell.properties, dataNumeric: "true" };
      }
    }
  }

  function visit(node) {
    if (isElement(node, "table")) processTable(node);
    for (const child of node.children ?? []) visit(child);
  }

  return (tree) => visit(tree);
}
