import { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import GreenTab from "../../atoms/GreenTab";
import LabelText from "../../atoms/Text/LabelText";
import TitleText from "../../atoms/Text/TitleText";
import {
  BanknoteIcon,
  ChartIcon,
  ChatBubbleDotsIcon,
  CodeIcon,
  DownloadIcon,
  GraduationCapIcon,
  HeartPulseIcon,
  LeafIcon,
  MessageSquareTextIcon,
  SearchIcon,
  TableChartViewIcon,
  VoteIcon,
} from "./Icons";
import ptQuestions from "../../../content/chatbot/onboarding/pt.json";
import enQuestions from "../../../content/chatbot/onboarding/en.json";
import esQuestions from "../../../content/chatbot/onboarding/es.json";

const SoftShadow =
  "0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 1px 3px -1px rgba(0, 0, 0, 0.06)";
const ElevatedShadow =
  "0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)";

const ThemesTab = 0;
const AnalysesTab = 1;
const FormatTab = 2;

const IdeaBadges = [
  { id: "health", tab: ThemesTab, Icon: HeartPulseIcon },
  { id: "education", tab: ThemesTab, Icon: GraduationCapIcon },
  { id: "economy", tab: ThemesTab, Icon: BanknoteIcon },
  { id: "environment", tab: ThemesTab, Icon: LeafIcon },
  { id: "politics", tab: ThemesTab, Icon: VoteIcon },
  { id: "analyses", tab: AnalysesTab, Icon: ChartIcon },
  { id: "format", tab: FormatTab, Icon: MessageSquareTextIcon },
];

const ThemeOptions = [
  { id: "health", Icon: HeartPulseIcon },
  { id: "education", Icon: GraduationCapIcon },
  { id: "economy", Icon: BanknoteIcon },
  { id: "environment", Icon: LeafIcon },
  { id: "politics", Icon: VoteIcon },
];

const DefaultTheme = ThemeOptions[0].id;

const ActiveThemeBadgeProps = {
  backgroundColor: "#2B8C4D",
  borderColor: "#2B8C4D",
  color: "#FFFFFF",
  _hover: {
    backgroundColor: "#22703E",
    borderColor: "#22703E",
    boxShadow: ElevatedShadow,
    "& .badge-icon": { color: "#FFFFFF" },
  },
};

const AnalysisItems = [
  { id: "findData", Icon: SearchIcon },
  { id: "analyze", Icon: CodeIcon },
  { id: "charts", Icon: ChartIcon },
  { id: "export", Icon: DownloadIcon },
];

const FormatItems = [
  { id: "text", Icon: ChatBubbleDotsIcon },
  { id: "table", Icon: TableChartViewIcon },
  { id: "chart", Icon: ChartIcon },
  { id: "sql", Icon: CodeIcon },
  { id: "download", Icon: DownloadIcon },
];

const IdeaBadgeProps = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 14px",
  borderRadius: "999px",
  border: "1px solid #DEDFE0",
  backgroundColor: "#FFFFFF",
  boxShadow: SoftShadow,
  color: "#464A51",
  fontFamily: "Roboto",
  fontSize: "14px",
  fontWeight: "500",
  lineHeight: "20px",
  textAlign: "left",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
  _hover: {
    borderColor: "#2B8C4D",
    boxShadow: ElevatedShadow,
    "& .badge-icon": { color: "#2B8C4D" },
  },
  _active: {
    transform: "scale(0.98)",
    boxShadow: SoftShadow,
  },
};

const ThemeQuestionsByLocale = {
  pt: ptQuestions,
  en: enQuestions,
  es: esQuestions,
};

function questionsForLocale(language) {
  const locale = String(language || "pt").split("-")[0];
  return ThemeQuestionsByLocale[locale] || ThemeQuestionsByLocale.pt;
}

function readThemeCards(value) {
  return (Array.isArray(value) ? value : [])
    .map((item) => {
      if (typeof item === "string") {
        const question = item.trim();
        return question ? { title: "", question } : null;
      }
      const title = String(item?.title || "").trim();
      const question = String(item?.question || "").trim();
      if (!question) return null;
      return { title, question };
    })
    .filter(Boolean);
}

export function IdeasModal({
  isOpen,
  onClose,
  tabIndex,
  onTabChange,
  activeTheme,
  onQuestionClick,
  isDisabled,
}) {
  const { t } = useTranslation("chatbot");
  const [selectedTheme, setSelectedTheme] = useState(activeTheme || DefaultTheme);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedTheme(activeTheme || DefaultTheme);
  }, [isOpen, activeTheme]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      scrollBehavior="inside"
      returnFocusOnClose={false}
    >
      <ModalOverlay />
      <ModalContent
        containerProps={{
          alignItems: { base: "stretch", md: "center" },
          height: { base: "100dvh", md: "100vh" },
        }}
        margin={{ base: 0, md: "24px" }}
        width={{ base: "100%", md: "1072px" }}
        maxWidth={{ base: "100%", md: "1072px" }}
        flexShrink={{ base: 1, md: 0 }}
        sx={{
          "@media (min-width: 48em)": {
            width: "1072px",
            maxWidth: "1072px",
          },
        }}
        height={{ base: "100%", md: "510px" }}
        maxHeight={{ base: "100%", md: "calc(100vh - 48px)" }}
        borderRadius={{ base: 0, md: "16px" }}
        paddingX={{ base: "20px", md: "32px" }}
        paddingTop={{
          base: "calc(16px + env(safe-area-inset-top, 0px))",
          md: "32px",
        }}
        paddingBottom={{
          base: "max(24px, env(safe-area-inset-bottom, 0px))",
          md: "32px",
        }}
        overflow="hidden"
      >
        <ModalHeader padding="0" marginBottom="8px" flexShrink={0}>
          <TitleText typography="medium" marginRight="32px">
            {t("ui.onboarding.title")}
          </TitleText>
          <ModalCloseButton
            fontSize="14px"
            top={{
              base: "calc(22px + env(safe-area-inset-top, 0px))",
              md: "34px",
            }}
            right={{ base: "16px", md: "26px" }}
            _hover={{ backgroundColor: "transparent", opacity: 0.7 }}
          />
        </ModalHeader>
        <ModalBody
          padding="0"
          overflow="hidden"
          display="flex"
          flexDirection="column"
          flex="1"
          minHeight="0"
        >
          <Tabs
            index={tabIndex}
            onChange={onTabChange}
            variant="unstyled"
            isLazy={false}
            display="flex"
            flexDirection="column"
            flex="1"
            minHeight="0"
            overflow="hidden"
          >
            <TabList
              flexShrink={0}
              borderBottom="1px solid #DEDFE0"
              overflowX="auto"
              overflowY="hidden"
              paddingX="24px"
              marginBottom="8px"
              sx={{
                "::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
              }}
            >
              <GreenTab
                whiteSpace="nowrap"
                flexShrink={0}
                padding="12px 16px 13px"
              >
                {t("ui.onboarding.tabs.themes")}
              </GreenTab>
              <GreenTab
                whiteSpace="nowrap"
                flexShrink={0}
                padding="12px 16px 13px"
              >
                {t("ui.onboarding.tabs.analyses")}
              </GreenTab>
              <GreenTab
                whiteSpace="nowrap"
                flexShrink={0}
                padding="12px 16px 13px"
              >
                {t("ui.onboarding.tabs.format")}
              </GreenTab>
            </TabList>
            <TabPanels flex="1" minHeight="0" overflowY="auto">
              <TabPanel padding="16px 0 0">
                <ThemeQuestions
                  selectedTheme={selectedTheme}
                  onThemeChange={setSelectedTheme}
                  onQuestionClick={onQuestionClick}
                  isDisabled={isDisabled}
                />
              </TabPanel>
              <TabPanel padding="16px 0 0">
                {/* <InfoList
                  intro={t("ui.onboarding.analysesIntro")}
                  items={AnalysisItems}
                  copyPrefix="ui.onboarding.analyses"
                /> */}
              </TabPanel>
              <TabPanel padding="16px 0 0">
                {/* <InfoList
                  intro={t("ui.onboarding.formatIntro")}
                  items={FormatItems}
                  copyPrefix="ui.onboarding.formats"
                /> */}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function ThemeQuestions({
  selectedTheme,
  onThemeChange,
  onQuestionClick,
  isDisabled,
}) {
  const { t, i18n } = useTranslation("chatbot");
  const cards = readThemeCards(questionsForLocale(i18n.language)[selectedTheme]);

  return (
    <Flex direction="column" gap="24px">
      <LabelText typography="medium" color="#464A51">
        {t("ui.onboarding.themesIntro")}
      </LabelText>
      <Flex wrap="wrap" gap="16px">
        {ThemeOptions.map(({ id, Icon }) => {
          const isActive = selectedTheme === id;

          return (
            <Box
              key={id}
              as="button"
              type="button"
              aria-pressed={isActive}
              onClick={() => onThemeChange(id)}
              {...IdeaBadgeProps}
              {...(isActive ? ActiveThemeBadgeProps : {})}
            >
              <Box
                as="span"
                className="badge-icon"
                display="inline-flex"
                color={isActive ? "#FFFFFF" : "#878A8E"}
                flexShrink={0}
                transition="color 0.15s ease"
              >
                <Icon width="16px" height="16px" color="currentColor" />
              </Box>
              {t(`ui.onboarding.badges.${id}`)}
            </Box>
          );
        })}
      </Flex>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(min(100%, 360px), 1fr))"
        gap="8px"
        marginTop="16px"
        alignItems="stretch"
      >
        {cards.map((card) => (
          <Box
            key={card.question}
            as="button"
            type="button"
            height="100%"
            textAlign="left"
            padding="14px"
            borderRadius="12px"
            border="1px solid #EEEEEE"
            backgroundColor="#FFFFFF"
            cursor={isDisabled ? "not-allowed" : "pointer"}
            opacity={isDisabled ? 0.5 : 1}
            disabled={isDisabled}
            transition="border-color 0.15s ease, background-color 0.15s ease"
            _hover={{
              borderColor: "#2B8C4D",
              backgroundColor: "#F7FBF8",
            }}
            onClick={() => onQuestionClick(card.question)}
          >
            {card.title ? (
              <Text
                fontFamily="Roboto"
                fontSize="14px"
                fontWeight="600"
                lineHeight="20px"
                color="#252A32"
                marginBottom="4px"
              >
                {card.title}
              </Text>
            ) : null}
            <Text
              fontFamily="Roboto"
              fontSize="14px"
              fontWeight="400"
              lineHeight="20px"
              color="#464A51"
            >
              {card.question}
            </Text>
          </Box>
        ))}
      </Box>
    </Flex>
  );
}

function InfoList({ intro, items, copyPrefix }) {
  const { t } = useTranslation("chatbot");

  return (
    <Flex direction="column" gap="12px">
      <Text
        fontFamily="Roboto"
        fontSize="14px"
        lineHeight="20px"
        color="#71757A"
      >
        {intro}
      </Text>
      {items.map(({ id, Icon }) => {
        const title = t(`${copyPrefix}.${id}.title`);
        const body = t(`${copyPrefix}.${id}.body`);
        if (!title || title === `${copyPrefix}.${id}.title`) return null;

        return (
          <Flex
            key={id}
            gap="12px"
            padding="14px"
            border="1px solid #EEEEEE"
            borderRadius="12px"
            backgroundColor="#FFFFFF"
          >
            <Flex
              align="center"
              justify="center"
              boxSize="36px"
              borderRadius="10px"
              backgroundColor="#F3FAF5"
              flexShrink={0}
              color="#2B8C4D"
            >
              <Icon width="18px" height="18px" color="currentColor" />
            </Flex>
            <Box>
              <Text
                fontFamily="Roboto"
                fontSize="14px"
                fontWeight="600"
                lineHeight="20px"
                color="#252A32"
              >
                {title}
              </Text>
              <Text
                fontFamily="Roboto"
                fontSize="14px"
                fontWeight="400"
                lineHeight="20px"
                color="#71757A"
                marginTop="4px"
              >
                {body}
              </Text>
            </Box>
          </Flex>
        );
      })}
    </Flex>
  );
}

export default function OnboardingQuestions({
  onQuestionClick,
  isDisabled,
  hasText = false,
}) {
  const { t } = useTranslation("chatbot");
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(ThemesTab);
  const [activeTheme, setActiveTheme] = useState(null);
  const frameRef = useRef(null);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(() => setMounted(true));
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const showBadges = mounted && !hasText;

  const openBadge = (badge) => {
    if (isDisabled) return;
    setTabIndex(badge.tab);
    setActiveTheme(badge.tab === ThemesTab ? badge.id : null);
    setIsOpen(true);
  };

  const handleQuestion = (question) => {
    if (isDisabled) return;
    setIsOpen(false);
    onQuestionClick?.(question);
  };

  return (
    <>
      <Box
        width="100%"
        maxWidth="760px"
        margin="0 auto"
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        gap="8px"
        paddingX={{ base: "4px", md: 0 }}
        pointerEvents={showBadges ? "auto" : "none"}
      >
        {IdeaBadges.map(({ id, tab, Icon }, index) => (
          <Box
            key={id}
            opacity={showBadges ? 1 : 0}
            transform={showBadges ? "translateY(0)" : "translateY(8px)"}
            transition="opacity 0.3s ease-out, transform 0.3s ease-out"
            transitionDelay={showBadges ? `${index * 60}ms` : "0ms"}
          >
            <Box
              as="button"
              type="button"
              aria-haspopup="dialog"
              disabled={isDisabled}
              opacity={isDisabled ? 0.5 : 1}
              cursor={isDisabled ? "not-allowed" : "pointer"}
              onClick={() => openBadge({ id, tab })}
              {...IdeaBadgeProps}
            >
              <Box
                as="span"
                className="badge-icon"
                display="inline-flex"
                color="#878A8E"
                flexShrink={0}
                transition="color 0.15s ease"
              >
                <Icon width="16px" height="16px" color="currentColor" />
              </Box>
              {t(`ui.onboarding.badges.${id}`)}
            </Box>
          </Box>
        ))}
      </Box>
      <IdeasModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        tabIndex={tabIndex}
        onTabChange={setTabIndex}
        activeTheme={activeTheme}
        onQuestionClick={handleQuestion}
        isDisabled={isDisabled}
      />
    </>
  );
}
