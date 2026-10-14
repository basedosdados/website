import { useMemo, useState } from "react";
import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  ModalCloseButton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import TitleText from "../../atoms/Text/TitleText";
import BodyText from "../../atoms/Text/BodyText";
import {
  ModalGeneral,
  Button,
  ExtraInfoTextForm,
} from "../../molecules/uiUserPage";
import { useChatbotContext } from "../../../context/ChatbotContext";
import { ChevronDownIcon, LightbulbIcon, TrashIcon } from "./Icons";
import { IdeasModal } from "./OnboardingQuestions";

const ThemesTab = 0;
const TitleLimit = 50;

function titleFromMessages(messages) {
  const firstUser = (messages || []).find((message) => message?.role === "user");
  return String(firstUser?.content || "").replace(/\s+/g, " ").trim();
}

function titleWithEllipsis(title, full) {
  const trimmed = String(title || "").trim();
  const source = String(full || "").replace(/\s+/g, " ").trim();
  const base = trimmed || source;
  if (!base || base.endsWith("...")) return base;
  if (trimmed.length >= TitleLimit) return `${trimmed}...`;
  if (trimmed && source.startsWith(trimmed) && source.length > trimmed.length) return `${trimmed}...`;
  return base;
}

export default function ThreadHeader({
  threadId,
  messages,
  onDeleted,
  onQuestionClick,
  isDisabled,
}) {
  const { t } = useTranslation("chatbot");
  const { threads, deleteThread, isDeleting } = useChatbotContext();
  const deleteModal = useDisclosure();
  const [menuOpen, setMenuOpen] = useState(false);
  const [ideasOpen, setIdeasOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(ThemesTab);
  const [activeTheme, setActiveTheme] = useState(null);

  const title = useMemo(() => {
    const fromList = (threads || []).find(
      (item) => String(item.id) === String(threadId)
    )?.title;
    return titleWithEllipsis(fromList, titleFromMessages(messages));
  }, [threads, threadId, messages]);

  const confirmDelete = async () => {
    if (!threadId) return;
    await deleteThread(threadId);
    deleteModal.onClose();
    onDeleted?.();
  };

  const handleQuestion = (question) => {
    if (isDisabled) return;
    setIdeasOpen(false);
    onQuestionClick?.(question);
  };

  const openIdeas = () => {
    if (isDisabled) return;
    setTabIndex(ThemesTab);
    setActiveTheme(null);
    setIdeasOpen(true);
  };

  return (
    <>
      <Box
        display={{ base: "none", md: title ? "block" : "none" }}
        position="relative"
        flexShrink={0}
        width="100%"
        zIndex={3}
        backgroundColor="#FFFFFF"
        padding="8px 24px"
      >
        <Flex
          width="100%"
          height="48px"
          align="center"
          justifyContent="space-between"
          gap="8px"
          minWidth={0}
        >
          <Flex flex="1" minWidth={0} height="100%" align="center" gap="4px">
            <BodyText
              minWidth={0}
              flex="0 1 auto"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              title={title}
            >
              {title}
            </BodyText>
            <Menu
              placement="bottom-start"
              autoSelect={false}
              isLazy
              isOpen={menuOpen}
              onOpen={() => setMenuOpen(true)}
              onClose={() => setMenuOpen(false)}
            >
              <MenuButton
                as={Box}
                aria-label={t("ui.thread.moreOptions")}
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                width="28px"
                height="28px"
                minWidth="28px"
                padding="0"
                lineHeight="0"
                borderRadius="8px"
                cursor="pointer"
                color="#71757A"
                flexShrink={0}
                sx={{
                  "& > span": {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
                _hover={{ backgroundColor: "#EEEEEE", color: "#252A32" }}
                _expanded={{ backgroundColor: "#EEEEEE", color: "#252A32" }}
              >
                <ChevronDownIcon
                  display="block"
                  width="16px"
                  height="16px"
                  color="currentColor"
                />
              </MenuButton>
              <MenuList
                minWidth="180px"
                padding="4px"
                borderRadius="8px"
                border="1px solid #DEDFE0"
                boxShadow="0px 1.5px 16px rgba(0, 0, 0, 0.16)"
              >
                <MenuItem
                  isDisabled={!threadId || isDeleting}
                  onClick={deleteModal.onOpen}
                  borderRadius="6px"
                  padding="8px"
                  fontFamily="Roboto"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#BF3434"
                  icon={<TrashIcon width="16px" height="16px" fill="currentColor" />}
                  _hover={{ backgroundColor: "#D03B3B", color: "#FFFFFF" }}
                  _focus={{ backgroundColor: "#D03B3B", color: "#FFFFFF" }}
                >
                  {t("ui.thread.deleteAction")}
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>

          <Box
            as="button"
            type="button"
            aria-label={t("ui.thread.openIdeas")}
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="28px"
            height="28px"
            borderRadius="8px"
            color="#878A8E"
            flexShrink={0}
            cursor={isDisabled ? "not-allowed" : "pointer"}
            opacity={isDisabled ? 0.5 : 1}
            disabled={isDisabled}
            transition="color 0.15s ease"
            _hover={isDisabled ? undefined : { color: "#2B8C4D", backgroundColor: "transparent" }}
            onClick={openIdeas}
          >
            <LightbulbIcon width="20px" height="20px" color="currentColor" />
          </Box>
        </Flex>
      </Box>

      <ModalGeneral
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        propsModalContent={{ minWidth: { base: "", lg: "620px !important" } }}
      >
        <Stack spacing={0} marginBottom="16px">
          <TitleText marginRight="20px">{t("ui.thread.deleteTitle")}</TitleText>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{ backgroundColor: "transparent", opacity: 0.7 }}
            onClick={() => deleteModal.onClose()}
          />
        </Stack>

        <Stack spacing="24px" marginBottom="16px">
          <ExtraInfoTextForm>{t("ui.thread.deleteConfirm")}</ExtraInfoTextForm>
        </Stack>

        <Stack
          flexDirection={{ base: "column-reverse", lg: "row" }}
          spacing={0}
          gap="16px"
          width={{ base: "100%", lg: "fit-content" }}
        >
          <Button
            width="100%"
            border="1px solid #BF3434"
            color="#BF3434"
            backgroundColor="#fff"
            _hover={{
              color: "#992A2A",
              borderColor: "#992A2A",
            }}
            onClick={() => deleteModal.onClose()}
          >
            {t("ui.cancel")}
          </Button>
          <Button
            width="100%"
            backgroundColor="#BF3434"
            _hover={{ backgroundColor: "#992A2A" }}
            onClick={() => confirmDelete()}
            isLoading={isDeleting}
          >
            {t("ui.delete")}
          </Button>
        </Stack>
      </ModalGeneral>

      <IdeasModal
        isOpen={ideasOpen}
        onClose={() => setIdeasOpen(false)}
        tabIndex={tabIndex}
        onTabChange={setTabIndex}
        activeTheme={activeTheme}
        onQuestionClick={handleQuestion}
        isDisabled={isDisabled}
      />
    </>
  );
}
