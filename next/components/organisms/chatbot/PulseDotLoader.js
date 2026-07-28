import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const dotSize = 8;
const dotColor = "#2B8C4D";

const breathe = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(0.85); opacity: 0.7; }
`;

export default function PulseDotLoader({ ...props }) {
  return (
    <Box
      width={`${dotSize}px`}
      height={`${dotSize}px`}
      role="status"
      aria-label="Pensando"
      {...props}
    >
      <Box
        width="100%"
        height="100%"
        borderRadius="50%"
        backgroundColor={dotColor}
        sx={{
          animation: `${breathe} 1.6s ease-in-out infinite`,
        }}
      />
    </Box>
  );
}
