import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

// Text shimmer adapted from the reference (ibelick/prompt-kit): a muted base
// with a narrow bright band that sweeps across the text — the gradient is
// clipped to the glyphs (background-clip: text) and animated by moving its
// position, rather than pulsing the whole text's colour.
const shimmerSweep = keyframes`
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
`;

const BASE = "#ACAEB1"; // muted
const BRIGHT = "#464A51"; // bright band

export default function TextShimmer({ children, spread = 12, ...props }) {
  // Width of the bright band, in percent of the gradient (5–45): larger is a
  // softer transition, smaller a sharper highlight.
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
