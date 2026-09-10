import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
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

export function ChartCard({ spec }) {
  const [isRevealed, setIsRevealed] = useState(false);

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
          onStatusChange={(status) => {
            if (status === "ready" || status === "error") setIsRevealed(true);
          }}
        />
      </Box>
    </Box>
  );
}
