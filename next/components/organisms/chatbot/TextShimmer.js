import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const shimmerSweep = keyframes`
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
`;

const BASE = "#ACAEB1";
const BRIGHT = "#464A51";

export default function TextShimmer({ children, spread = 12, ...props }) {
  const bounded = Math.min(Math.max(spread, 5), 45);
  return (
    <Box
      as="span"
      display="inline-block"
      backgroundImage={`linear-gradient(to right, ${BASE} ${50 - bounded}%, ${BRIGHT} 50%, ${BASE} ${50 + bounded}%)`}
      backgroundSize="200% auto"
      animation={`${shimmerSweep} 2s linear infinite`}
      sx={{
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
