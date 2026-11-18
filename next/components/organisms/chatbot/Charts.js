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
      >
        <ModalCloseButton top="12px" right="12px" zIndex={30} />
        <ModalBody padding={{ base: "52px 12px 16px", md: "52px 24px 24px" }}>
          <VegaChart spec={spec} expanded />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export function ChartCard({ spec }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
        width="100%"
        minWidth={0}
        padding={{ base: "12px", md: "16px" }}
        borderRadius="12px"
        border="1px solid #E5E7EB"
        backgroundColor="#FFFFFF"
      >
        <VegaChart
          spec={spec}
          onExpand={() => setIsExpanded(true)}
          onStatusChange={(status) => {
            if (status !== "loading") setIsRevealed(true);
          }}
        />
      </Box>
      {isExpanded && <ExpandedChart spec={spec} onClose={() => setIsExpanded(false)} />}
    </Box>
  );
}
