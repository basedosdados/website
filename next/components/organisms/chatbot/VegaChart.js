import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import BodyText from "../../atoms/Text/BodyText";

const CHART_CONFIG = {
  font: "Roboto",
  background: "transparent",
  axis: {
    labelColor: "#464A51",
    titleColor: "#252A32",
    gridColor: "#EEEEEE",
    domainColor: "#DEDFE0",
    tickColor: "#DEDFE0",
    labelFontSize: 11,
    titleFontSize: 12,
  },
  legend: {
    labelColor: "#464A51",
    titleColor: "#252A32",
    labelFontSize: 11,
    titleFontSize: 12,
  },
  title: {
    color: "#252A32",
    fontSize: 15,
    fontWeight: 600,
    anchor: "start",
  },
  view: { stroke: "transparent" },
};

function mergeConfig(base, override) {
  if (!override || typeof override !== "object" || Array.isArray(override)) {
    return override === undefined ? base : override;
  }
  const out = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = out[key];
    out[key] =
      current &&
      typeof current === "object" &&
      !Array.isArray(current) &&
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
        ? mergeConfig(current, value)
        : value;
  }
  return out;
}

const EMBED_ACTIONS = {
  export: true,
  source: false,
  compiled: false,
  editor: false,
};

export default function VegaChart({ spec, onStatusChange }) {
  const containerRef = useRef(null);
  const onStatusChangeRef = useRef(onStatusChange);
  const [status, setStatus] = useState("loading");

  onStatusChangeRef.current = onStatusChange;

  useEffect(() => {
    if (!spec || typeof spec !== "object") {
      setStatus("error");
      onStatusChangeRef.current?.("error");
      return undefined;
    }

    let cancelled = false;
    let embedded = null;
    const container = containerRef.current;

    setStatus("loading");

    (async () => {
      try {
        const { default: embed } = await import("vega-embed");
        if (cancelled || !container) return;

        const responsiveSpec = {
          ...spec,
          width: "container",
          autosize: { type: "fit", contains: "padding", ...(spec.autosize || {}) },
          config: mergeConfig(CHART_CONFIG, spec.config),
        };

        const embedOptions = {
          actions: EMBED_ACTIONS,
          renderer: "canvas",
          downloadFileName: spec.title || "grafico",
        };

        embedded = await embed(container, responsiveSpec, embedOptions);

        if (cancelled) {
          embedded.finalize?.();
          return;
        }
        setStatus("ready");
        onStatusChangeRef.current?.("ready");
      } catch (error) {
        console.error("Falha ao renderizar o gráfico:", error);
        if (!cancelled) {
          setStatus("error");
          onStatusChangeRef.current?.("error");
        }
      }
    })();

    return () => {
      cancelled = true;
      embedded?.finalize?.();
      if (container) container.innerHTML = "";
    };
  }, [spec]);

  return (
    <Box position="relative" width="100%" minWidth={0}>
      {status === "loading" && (
        <Flex align="center" justify="center" gap="8px" padding="24px 0" color="#71757A">
          <Spinner width="16px" height="16px" thickness="2px" />
          <BodyText typography="small" color="inherit">
            Gerando gráfico...
          </BodyText>
        </Flex>
      )}
      {status === "error" && (
        <Flex align="center" justify="center" padding="24px 0" color="#71757A">
          <BodyText typography="small" color="inherit">
            Não foi possível exibir o gráfico.
          </BodyText>
        </Flex>
      )}
      <Box
        ref={containerRef}
        width="100%"
        minWidth={0}
        position={status === "ready" ? "relative" : "absolute"}
        left={0}
        right={status === "ready" ? undefined : 0}
        opacity={status === "ready" ? 1 : 0}
        pointerEvents={status === "ready" ? "auto" : "none"}
        overflowX="auto"
        sx={{
          canvas: { maxWidth: "100%" },
          "svg.marks": { maxWidth: "100%", height: "auto" },
          details: {
            position: "absolute !important",
            top: "4px",
            right: "4px",
            margin: "0 !important",
          },
          summary: {
            listStyle: "none !important",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px !important",
            height: "28px !important",
            borderRadius: "8px",
            color: "#71757A",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "1px solid #E5E7EB",
            boxShadow: "none !important",
            opacity: 0.55,
            transition: "opacity 0.2s ease, background-color 0.2s ease",
          },
          "&:hover summary": { opacity: 1 },
          "summary:hover": { backgroundColor: "#FFFFFF" },
          "summary::-webkit-details-marker": { display: "none !important" },
          "summary svg": {
            width: "16px !important",
            height: "16px !important",
          },
          ".vega-actions": {
            position: "absolute",
            top: "36px",
            right: "0",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0px 1.5px 16px rgba(0, 0, 0, 0.16)",
            padding: "8px 0",
            zIndex: 20,
          },
          ".vega-actions::before, .vega-actions::after": {
            display: "none !important",
          },
          ".vega-actions a": {
            padding: "6px 16px",
            fontFamily: "Roboto",
            fontSize: "13px",
            lineHeight: "20px",
            color: "#252A32",
            textDecoration: "none",
            whiteSpace: "nowrap",
          },
          ".vega-actions a:hover": {
            backgroundColor: "#F7F7F7",
            color: "#252A32",
          },
        }}
      />
    </Box>
  );
}
