import { Box, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { DataStructureIcon, TableChartViewIcon, ChartIcon } from "./icons";

const SHADOW_SOFT =
  "0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 1px 3px -1px rgba(0, 0, 0, 0.06)";
const SHADOW_ELEVATED =
  "0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)";

const OnboardingIcons = [TableChartViewIcon, ChartIcon, DataStructureIcon];

export default function OnboardingQuestions({
  onQuestionClick,
  isDisabled,
  hasText = false,
}) {
  const { t } = useTranslation("chatbot");
  // Start hidden so the cards slide in one paint after mount (like the reference).
  const [mounted, setMounted] = useState(false);
  // Latches on pick so the cards don't flash back during the async gap before the
  // thread view takes over.
  const [submitted, setSubmitted] = useState(false);
  const frameRef = useRef(null);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(() => setMounted(true));
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const rawItems = t("ui.onboarding.items", { returnObjects: true });
  const items = (Array.isArray(rawItems) ? rawItems : [])
    .map((item, index) => ({
      eyebrow: item?.eyebrow,
      question: item?.question,
      Icon: OnboardingIcons[index] ?? DataStructureIcon,
    }))
    .filter((item) => String(item?.question || "").trim());

  if (items.length === 0) return null;

  // Hidden until mounted, and while the composer has text or a card was picked —
  // so the cards slide out of the way as soon as the user starts writing.
  const showCards = mounted && !hasText && !submitted;

  const handlePick = (question) => {
    if (isDisabled) return;
    setSubmitted(true);
    onQuestionClick?.(question);
  };

  return (
    <Box
      width="100%"
      maxWidth="760px"
      margin="0 auto"
      display="grid"
      gridTemplateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }}
      gap="8px"
      paddingX={{ base: "4px", md: 0 }}
    >
      {items.map(({ eyebrow, question, Icon }, index) => {
        const trimmed = question.trim();

        return (
          <Box
            key={eyebrow}
            role="group"
            height="100%"
            opacity={showCards ? 1 : 0}
            transform={showCards ? "translateY(0)" : "translateY(8px)"}
            pointerEvents={showCards ? "auto" : "none"}
            transition="opacity 0.3s ease-out, transform 0.3s ease-out"
            transitionDelay={showCards ? `${index * 150}ms` : "0ms"}
            sx={{ willChange: "transform" }}
          >
            <Box
              as="button"
              type="button"
              position="relative"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              gap="6px"
              width="100%"
              height="100%"
              padding="14px"
              textAlign="left"
              backgroundColor="transparent"
              border="none"
              disabled={isDisabled}
              opacity={isDisabled ? 0.5 : 1}
              cursor={isDisabled ? "not-allowed" : "pointer"}
              pointerEvents={isDisabled ? "none" : "auto"}
              onClick={() => handlePick(trimmed)}
            >
              {/* Only this surface layer scales on hover, so the text stays crisp. */}
              <Box
                aria-hidden
                position="absolute"
                inset={0}
                borderRadius="12px"
                border="1px solid #DEDFE0"
                backgroundColor="#FFFFFF"
                boxShadow={SHADOW_SOFT}
                transition="transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease"
                _groupHover={{
                  transform: "scale(1.03)",
                  borderColor: "#2B8C4D",
                  boxShadow: SHADOW_ELEVATED,
                }}
                _groupActive={{
                  transform: "scale(0.99)",
                  boxShadow: SHADOW_SOFT,
                }}
              />
              <Box
                as="span"
                position="relative"
                display="inline-flex"
                alignItems="center"
                gap="6px"
                color="#2B8C4D"
              >
                <Box
                  as="span"
                  display="inline-flex"
                  transition="transform 0.15s ease"
                  _groupHover={{ transform: "scale(1.1)" }}
                >
                  <Icon width="14px" height="14px" fill="currentColor" />
                </Box>
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
              <Text
                as="span"
                position="relative"
                display="block"
                fontFamily="Roboto"
                fontSize="14px"
                fontWeight="400"
                lineHeight="20px"
                letterSpacing="0.1px"
                color="#464A51"
              >
                {trimmed}
              </Text>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
