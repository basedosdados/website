import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";

import BodyText from "../../atoms/Text/BodyText";
import {
  Cancelled,
  PREVIEW_MAX_HEIGHT,
  drawChart,
  isNarrowPanel,
  saveChart,
  titleText,
} from "./chartDraw";
import { DownloadIcon, MaximizeIcon } from "./Icons";

// The chart is laid out again when its panel's width changes by at least this much
// (a window resized, a phone turned, the sidebar opened).
const RESIZE_STEP = 8;

// Width of an element, updated as it is resized.
function useWidth(ref) {
  const [width, setWidth] = useState(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    setWidth(element.clientWidth);
    if (typeof ResizeObserver === "undefined") return undefined;
    let timer = null;
    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const next = element.clientWidth;
        setWidth((current) =>
          current === null || Math.abs(next - current) >= RESIZE_STEP ? next : current
        );
      }, 150);
    });
    observer.observe(element);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [ref]);
  return width;
}

// The chat's action tooltips (as in `Message.js`), opening toward the left: the chart's
// buttons sit at its right edge.
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
  placement: "top-end",
};

// The chart's download menu, as the chat's results download menu (`DownloadResults.js`).
const MenuListProps = {
  boxShadow: "0px 1.5px 16px rgba(0, 0, 0, 0.16)",
  _focus: { boxShadow: "0px 1.5px 16px rgba(0, 0, 0, 0.16) !important" },
  padding: "8px 0",
  borderRadius: "8px",
  zIndex: "11",
  color: "#252A32",
  // As wide as its items, not Chakra's default minimum.
  minWidth: "auto",
};

const MenuItemProps = {
  letterSpacing: "0.1px",
  lineHeight: "20px",
  fontWeight: "400",
  fontSize: "14px",
  fontFamily: "Roboto",
  color: "#252A32",
  backgroundColor: "#FFF",
  padding: "8px 16px",
  _focus: { backgroundColor: "transparent" },
  _hover: { backgroundColor: "transparent", opacity: "0.7" },
};

// The chart's buttons (download, expand) are faint until the pointer is over the chart,
// and the one under the pointer darkens.
const iconButtonStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "28px",
  height: "28px",
  borderRadius: "8px",
  color: "#71757A",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  border: "1px solid #E5E7EB",
  cursor: "pointer",
  opacity: 0.55,
  transition: "opacity 0.2s ease, background-color 0.2s ease, color 0.2s ease",
  _groupHover: { opacity: 1 },
  _hover: { opacity: 1, color: "#252A32", backgroundColor: "#EEEEEE" },
  _focusVisible: { opacity: 1 },
};

// Draws a chart laid out for the width it has (see `chartLayout.js`).
//
// Inline, a chart that does not fit even so (a grid of panels too wide for a phone, a
// very tall chart) is shown as a preview image that opens it in full, through
// `onExpand`. Expanded, it is always drawn, and the expanded view scrolls where it does
// not fit.
export default function VegaChart({ spec, onStatusChange, onExpand, expanded = false }) {
  const { t } = useTranslation("chatbot");
  const frameRef = useRef(null);
  const containerRef = useRef(null);
  const onStatusChangeRef = useRef(onStatusChange);
  const [status, setStatus] = useState("loading");
  const [preview, setPreview] = useState(null);
  const frameWidth = useWidth(frameRef);
  // The drawn chart, for its download menu.
  const handleRef = useRef(null);

  onStatusChangeRef.current = onStatusChange;

  useEffect(() => {
    const report = (next) => {
      setStatus(next);
      onStatusChangeRef.current?.(next);
    };

    if (!spec || typeof spec !== "object") {
      report("error");
      return undefined;
    }
    if (!frameWidth) return undefined;

    let cancelled = false;
    const handle = { embedded: null };
    handleRef.current = handle;
    // Each layout draws into an element of its own, so that a draw still running when the
    // layout is replaced (a new width) cannot leave its chart beside the new one.
    const container = document.createElement("div");
    containerRef.current?.replaceChildren(container);

    setStatus("loading");
    setPreview(null);

    (async () => {
      try {
        const { default: embed } = await import("vega-embed");
        // Measure the titles with the real font, not a fallback with other widths.
        await document.fonts?.ready;
        if (cancelled) return;

        const result = await drawChart({
          embed,
          container,
          spec,
          frameWidth,
          expanded,
          handle,
          isCancelled: () => cancelled,
        });
        if (cancelled) return;
        if (result.status === "preview") setPreview(result.preview);
        report(result.status);
      } catch (error) {
        if (cancelled || error instanceof Cancelled) return;
        console.error("Falha ao renderizar o gráfico:", error);
        report("error");
      }
    })();

    return () => {
      cancelled = true;
      handle.embedded?.finalize?.();
      container.remove();
    };
  }, [spec, frameWidth, expanded]);

  const isDrawn = status === "ready";
  const narrow = frameWidth !== null && isNarrowPanel(frameWidth);
  const croppedRight = preview && preview.width > frameWidth;
  const croppedBottom = preview && preview.height > PREVIEW_MAX_HEIGHT;

  return (
    <Box ref={frameRef} role="group" position="relative" width="100%" minWidth={0}>
      {status === "loading" && (
        <Flex align="center" justify="center" gap="8px" padding="24px 0" color="#71757A">
          <Spinner width="16px" height="16px" thickness="2px" />
          <BodyText typography="small" color="inherit">
            {t("ui.chart.loading")}
          </BodyText>
        </Flex>
      )}
      {status === "error" && (
        <Flex align="center" justify="center" padding="24px 0" color="#71757A">
          <BodyText typography="small" color="inherit">
            {t("ui.chart.error")}
          </BodyText>
        </Flex>
      )}

      {status === "preview" && preview && (
        <Box
          as="button"
          type="button"
          role="group"
          onClick={onExpand}
          aria-label={t("ui.chart.expand")}
          display="block"
          position="relative"
          width="100%"
          maxHeight={`${PREVIEW_MAX_HEIGHT}px`}
          overflow="hidden"
          borderRadius="8px"
          cursor="zoom-in"
          textAlign="left"
          _focusVisible={{ outline: "2px solid #2B8C4D", outlineOffset: "2px" }}
        >
          <img
            src={preview.url}
            alt={titleText(spec?.title)}
            width={preview.width}
            height={preview.height}
            style={{ display: "block", maxWidth: "none" }}
          />
          {croppedRight && (
            <Box
              position="absolute"
              top={0}
              right={0}
              bottom={0}
              width="48px"
              pointerEvents="none"
              background="linear-gradient(to right, rgba(255,255,255,0), #FFFFFF)"
            />
          )}
          {croppedBottom && (
            <Box
              position="absolute"
              left={0}
              right={0}
              bottom={0}
              height="72px"
              pointerEvents="none"
              background="linear-gradient(to bottom, rgba(255,255,255,0), #FFFFFF)"
            />
          )}
          {/* The pill lifts with the card, and under the pointer itself takes the hover of
              the site's outlined buttons (`atoms/Button.js`). It sits above the card's
              hover tint (see `ChartCard`), so it stays white. */}
          <Flex
            position="absolute"
            zIndex={1}
            left="50%"
            bottom="12px"
            transform="translateX(-50%)"
            align="center"
            gap="6px"
            padding="6px 12px"
            borderRadius="999px"
            backgroundColor="#FFFFFF"
            border="1px solid #E5E7EB"
            boxShadow="0px 1.5px 8px rgba(0, 0, 0, 0.12)"
            color="#252A32"
            fontFamily="Roboto"
            fontSize="13px"
            lineHeight="20px"
            whiteSpace="nowrap"
            transition="all 0.2s ease"
            _groupHover={{
              transform: "translateX(-50%) translateY(-2px)",
              boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.16)",
            }}
            _groupFocusVisible={{
              transform: "translateX(-50%) translateY(-2px)",
              boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.16)",
            }}
            _hover={{ color: "#22703E", borderColor: "#22703E" }}
          >
            <MaximizeIcon width="14px" height="14px" />
            {t("ui.chart.viewFull")}
          </Flex>
        </Box>
      )}

      {/* Download and expand: one above the other in the gutter right of the chart, or
          side by side over the end of its title on a narrow panel (see `ACTIONS_GUTTER`). */}
      <Flex
        position="absolute"
        top="4px"
        right="4px"
        zIndex={10}
        direction={narrow ? "row-reverse" : "column"}
        gap="4px"
      >
        {isDrawn && (
          <Menu placement="bottom-end">
            {({ isOpen }) => (
              <>
                <Tooltip {...ActionTooltipProps} label={t("ui.chart.download")} isDisabled={isOpen}>
                  <MenuButton
                    as={Box}
                    role="button"
                    aria-label={t("ui.chart.download")}
                    {...iconButtonStyle}
                    // Chakra wraps the icon in an inline span; centered like the expand icon.
                    sx={{ "& > span": { display: "flex", justifyContent: "center" } }}
                  >
                    <DownloadIcon width="16px" height="16px" />
                  </MenuButton>
                </Tooltip>
                <MenuList {...MenuListProps}>
                  {["png", "svg"].map((format) => (
                    <MenuItem
                      key={format}
                      {...MenuItemProps}
                      onClick={() =>
                        saveChart(handleRef.current.embedded.view, format, spec.title)
                      }
                    >
                      {t(`ui.chart.save.${format}`)}
                    </MenuItem>
                  ))}
                </MenuList>
              </>
            )}
          </Menu>
        )}
        {onExpand && !expanded && (isDrawn || status === "preview") && (
          <Tooltip {...ActionTooltipProps} label={t("ui.chart.expand")}>
            <Box
              as="button"
              type="button"
              onClick={onExpand}
              aria-label={t("ui.chart.expand")}
              {...iconButtonStyle}
            >
              <MaximizeIcon width="16px" height="16px" />
            </Box>
          </Tooltip>
        )}
      </Flex>

      <Box
        ref={containerRef}
        width="100%"
        minWidth={0}
        position={isDrawn ? "relative" : "absolute"}
        top={0}
        left={0}
        right={isDrawn ? undefined : 0}
        opacity={isDrawn ? 1 : 0}
        pointerEvents={isDrawn ? "auto" : "none"}
        // No size cap on the canvas: CSS scaling would squash the chart (its height is set
        // in pixels) and put the pointer off its marks.
      />
    </Box>
  );
}
