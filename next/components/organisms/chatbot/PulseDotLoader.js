import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useTranslation } from "next-i18next";

const dotSize = 8;
const dotColor = "#2B8C4D";

// A middle-ground between the reference's `pulse-dot` (scale 0.7↔1.4) and BD's
// gentler original (scale 1↔0.85): a moderate scale-up with a slight opacity
// lift (BD keeps its own colour).
const pulseDot = keyframes`
  0%, 100% { transform: scale(0.8); opacity: 0.8; }
  50%      { transform: scale(1.2); opacity: 1; }
`;

export default function PulseDotLoader({ ...props }) {
  const { t } = useTranslation("chatbot");
  return (
    <Box
      width={`${dotSize}px`}
      height={`${dotSize}px`}
      role="status"
      aria-label={t("ui.thinkingAria")}
      {...props}
    >
      <Box
        width="100%"
        height="100%"
        borderRadius="50%"
        backgroundColor={dotColor}
        sx={{
          animation: `${pulseDot} 1.5s ease-in-out infinite`,
        }}
      />
    </Box>
  );
}
