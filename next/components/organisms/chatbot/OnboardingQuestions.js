import { Box, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useTranslation } from "next-i18next";
import DataStructureIcon from "../../../public/img/icons/dataStructureIcon";
import TableChartViewIcon from "../../../public/img/icons/tableChartViewIcon";
import DocIcon from "../../../public/img/icons/docIcon";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const OnboardingIcons = [TableChartViewIcon, DataStructureIcon, DocIcon];

const QuestionChipProps = {
  as: "button",
  type: "button",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  width: "100%",
  height: "100%",
  gap: "6px",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid #DEDFE0",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 1px 2px rgba(20, 23, 26, 0.04)",
  color: "#464A51",
  fontFamily: "Roboto",
  fontSize: "14px",
  fontWeight: "400",
  lineHeight: "20px",
  letterSpacing: "0.1px",
  textAlign: "left",
  cursor: "pointer",
  transition:
    "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, color 0.2s ease",
  _hover: {
    transform: "translateY(-2px)",
    borderColor: "#2B8C4D",
    boxShadow: "0 8px 20px rgba(20, 23, 26, 0.08)",
  },
  _active: {
    transform: "translateY(0)",
    boxShadow: "0 1px 2px rgba(20, 23, 26, 0.04)",
  },
  _disabled: {
    opacity: 0.5,
    cursor: "not-allowed",
    pointerEvents: "none",
  },
};

export default function OnboardingQuestions({ onQuestionClick, isDisabled }) {
  const { t } = useTranslation("chatbot");
  const rawItems = t("ui.onboarding.items", { returnObjects: true });
  const items = (Array.isArray(rawItems) ? rawItems : [])
    .map((item, index) => ({
      eyebrow: item?.eyebrow,
      question: item?.question,
      Icon: OnboardingIcons[index] ?? DocIcon,
    }))
    .filter((item) => String(item?.question || "").trim());

  if (items.length === 0) return null;

  return (
    <Box
      width="100%"
      maxWidth="760px"
      margin="0 auto"
      display="grid"
      gridTemplateColumns={{
        base: "1fr",
        sm: "1fr 1fr",
        lg: "1fr 1fr 1fr",
      }}
      gap="10px"
      paddingX={{ base: "4px", md: 0 }}
    >
      {items.map(({ eyebrow, question, Icon }, index) => {
        const trimmed = question.trim();

        return (
          <Box
            key={eyebrow}
            {...QuestionChipProps}
            disabled={isDisabled}
            sx={{
              animation: `${fadeInUp} 0.35s ease-out both`,
              animationDelay: `${index * 80}ms`,
            }}
            onClick={() => {
              if (isDisabled) return;
              onQuestionClick?.(trimmed);
            }}
          >
            <Box
              as="span"
              display="inline-flex"
              alignItems="center"
              gap="6px"
              color="#2B8C4D"
            >
              <Icon width="14px" height="14px" fill="currentColor" />
              <Text
                as="span"
                fontSize="11px"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.4px"
              >
                {eyebrow}
              </Text>
            </Box>
            <Text as="span" display="block">
              {trimmed}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
