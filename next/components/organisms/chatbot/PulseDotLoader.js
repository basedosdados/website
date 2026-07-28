import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const dotSize = 8;
const dotColor = "#2B8C4D";

const ping = keyframes`
  0%   { transform: scale(1); opacity: 0.55; }
  100% { transform: scale(2.6); opacity: 0; }
`;

const breathe = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(0.85); opacity: 0.7; }
`;

export default function PulseDotLoader({ marginBottom = "16px" }) {
  return (
    <Box
      width="34px"
      height="34px"
      marginBottom={marginBottom}
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      role="status"
      aria-label="Pensando"
    >
      <Box position="relative" width={`${dotSize}px`} height={`${dotSize}px`}>
        <Box
          position="absolute"
          inset={0}
          borderRadius="50%"
          backgroundColor={dotColor}
          sx={{
            animation: `${ping} 1.6s cubic-bezier(0, 0, 0.2, 1) infinite`,
          }}
        />
        <Box
          position="absolute"
          inset={0}
          borderRadius="50%"
          backgroundColor={dotColor}
          sx={{
            animation: `${breathe} 1.6s ease-in-out infinite`,
          }}
        />
      </Box>
    </Box>
  );
}
