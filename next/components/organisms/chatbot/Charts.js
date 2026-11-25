import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Global, keyframes } from "@emotion/react";
import { useState } from "react";

import VegaChart from "./VegaChart";

const ChartFadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const ChartFadeInProps = {
  sx: {
    animation: `${ChartFadeIn} 0.4s ease-out both`,
  },
};

// The chat's scrollbar (as in `ChatWindow.js`), in both directions: a chart wider than the
// expanded view scrolls sideways. Its room is kept from the start, so the chart, laid out
// before it is known to need a scrollbar, still fits once it shows one.
const ScrollbarSx = {
  scrollbarGutter: "stable",
  "&::-webkit-scrollbar": { width: "6px", height: "6px", background: "transparent" },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  "&::-webkit-scrollbar-corner": { background: "transparent" },
  "&::-webkit-scrollbar-thumb": { background: "#C4C4C4", borderRadius: "24px" },
  "&::-webkit-scrollbar-thumb:hover": { background: "#ACAEB1" },
};

// The chart in a panel as large as the screen allows, drawn again at that size (not
// zoomed), with its tooltips. On a phone it takes the whole screen.
function ExpandedChart({ spec, onClose }) {
  const isPhone = useBreakpointValue({ base: true, md: false });

  return (
    <Modal
      isOpen
      onClose={onClose}
      size={isPhone ? "full" : "6xl"}
      isCentered={!isPhone}
      scrollBehavior="inside"
    >
      {/* vega-tooltip sits at z-index 1000, under Chakra's modal (1400). */}
      <Global styles={{ "#vg-tooltip-element": { zIndex: 1500 } }} />
      <ModalOverlay />
      <ModalContent
        width="100%"
        maxWidth={isPhone ? "100vw" : "min(1400px, 94vw)"}
        maxHeight={isPhone ? "100vh" : "92vh"}
        margin={isPhone ? 0 : undefined}
        borderRadius={isPhone ? 0 : "12px"}
        // Clips the scrollbar to the rounded corners.
        overflow="hidden"
      >
        <ModalCloseButton top="12px" right="12px" zIndex={30} />
        <ModalBody padding={{ base: "52px 12px 16px", md: "52px 24px 24px" }} sx={ScrollbarSx}>
          <VegaChart spec={spec} expanded />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export function ChartCard({ spec }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState("loading");
  // A chart too large for the chat shows as a preview, and the whole card opens it.
  const isPreview = status === "preview";

  if (!spec || typeof spec !== "object") return null;

  return (
    <Box
      width="100%"
      minWidth={0}
      overflow={isRevealed ? "visible" : "hidden"}
      maxHeight={isRevealed ? "none" : "0"}
      aria-hidden={!isRevealed}
      {...(isRevealed ? ChartFadeInProps : {})}
    >
      <Box
        position="relative"
        width="100%"
        minWidth={0}
        padding={{ base: "12px", md: "16px" }}
        borderRadius="12px"
        border="1px solid #E5E7EB"
        backgroundColor="#FFFFFF"
        role={isPreview ? "group" : undefined}
        cursor={isPreview ? "zoom-in" : undefined}
        onClick={isPreview ? () => setIsExpanded(true) : undefined}
      >
        <VegaChart
          spec={spec}
          onExpand={() => setIsExpanded(true)}
          onStatusChange={(next) => {
            setStatus(next);
            if (next !== "loading") setIsRevealed(true);
          }}
        />
        {/* Hovering a preview tints the whole card, so all of it reads as clickable. A
            layer over the card, not its background: the preview's fades end in white. */}
        {isPreview && (
          <Box
            position="absolute"
            inset={0}
            borderRadius="inherit"
            pointerEvents="none"
            backgroundColor="rgba(37, 42, 50, 0.025)"
            opacity={0}
            transition="opacity 0.2s ease"
            _groupHover={{ opacity: 1 }}
          />
        )}
      </Box>
      {isExpanded && <ExpandedChart spec={spec} onClose={() => setIsExpanded(false)} />}
    </Box>
  );
}
