import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useTranslation } from "next-i18next";

const dotSize = 8;
const dotColor = "#2B8C4D";

const breathe = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(0.85); opacity: 0.7; }
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
          animation: `${breathe} 1.6s ease-in-out infinite`,
        }}
      />
    </Box>
  );
}
