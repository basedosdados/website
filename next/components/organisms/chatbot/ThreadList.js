import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import {
  VStack,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SkeletonText,
  useDisclosure,
  ModalCloseButton,
  Stack
} from '@chakra-ui/react';
import BodyText from '../../atoms/Text/BodyText';
import TitleText from '../../atoms/Text/TitleText';
import {
  ModalGeneral,
  Button,
  ExtraInfoTextForm
} from '../../molecules/uiUserPage';
import { useChatbotContext } from '../../../context/ChatbotContext';
import { TrashIcon, ReloadIcon, MoreVerticalIcon } from "./icons";

// On hover, softly fade the right edge of the thread title into the space the
// options button occupies, instead of a hard ellipsis under the button.
const THREAD_TITLE_FADE =
  "linear-gradient(to right, #000 calc(100% - 40px), transparent calc(100% - 12px))";

// Slim, arrowless scrollbar copied from the reference. Deliberately omits
// `scrollbar-width`/`scrollbar-color`: once either is set, Chromium falls back
// to the native scrollbar (with OS arrow buttons) and ignores the webkit
// pseudo-element rules below. The inset thumb (transparent border + padding-box
// clip) leaves a little breathing room around the bar.
// Selected-thread accents: a light green fill with a darker green bar down the
// left edge (BD brand green #2B8C4D), mirroring the reference's active row.
const ACTIVE_BG = "rgba(43, 140, 77, 0.12)";
const ACTIVE_BG_HOVER = "rgba(43, 140, 77, 0.18)";
const ACTIVE_BAR = "#2B8C4D";

const SCROLLBAR_SX = {
  "&::-webkit-scrollbar": { width: "10px" },
  "&::-webkit-scrollbar-button": { display: "none", width: 0, height: 0 },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  "&::-webkit-scrollbar-corner": { background: "transparent" },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#C4C4C4",
    borderRadius: "8px",
    border: "2px solid transparent",
    backgroundClip: "padding-box",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#ACAEB1",
    border: "2px solid transparent",
    backgroundClip: "padding-box",
  },
};

export default function ThreadList({ onSelectThread, currentThreadId, isSidebarOpen, onNewChat }) {
  const { t } = useTranslation('chatbot');
  const router = useRouter();
  const { threads, isLoading, error, refetch, deleteThread, isDeleting } = useChatbotContext();
  const deleteModal = useDisclosure();
  const [threadToDelete, setThreadToDelete] = useState(null);

  const sortedThreads = useMemo(() => {
    if (!threads?.length) return [];
    const toTime = (value) => {
      if (value == null) return 0;
      const t = new Date(value).getTime();
      return Number.isFinite(t) ? t : 0;
    };
    return [...threads].sort(
      (a, b) => toTime(b.created_at) - toTime(a.created_at)
    );
  }, [threads]);

  const handleSelectThread = (thread) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, t: thread.id }
    }, undefined, { shallow: true });

    if (onSelectThread) onSelectThread(thread);
  };

  const handleDeleteClick = (e, thread) => {
    e.stopPropagation();
    setThreadToDelete(thread);
    deleteModal.onOpen();
  };

  const confirmDelete = async () => {
    if (threadToDelete) {
      const isDeletingCurrent = threadToDelete.id === currentThreadId;
      await deleteThread(threadToDelete.id);
      deleteModal.onClose();
      setThreadToDelete(null);

      if (isDeletingCurrent && onNewChat) {
        onNewChat();
      }
    }
  };

  const hasHistoryContent = Boolean(error) || sortedThreads.length > 0;

  if (isLoading) {
    return (
      <VStack
        align="stretch"
        spacing="20px"
        padding="16px 10px"
        marginTop="16px"
        width="100%"
      >
        <SkeletonText
          startColor="#DEDFE0"
          endColor="#EEEEEE"
          borderRadius="6px"
          noOfLines={1}
          spacing="8px"
          skeletonHeight="18px"
          width="60%"
        />
        {new Array(3).fill(0).map((_, index) => (
          <SkeletonText
            key={index}
            startColor="#DEDFE0"
            endColor="#EEEEEE"
            borderRadius="6px"
            noOfLines={1}
            spacing="8px"
            skeletonHeight="18px"
          />
        ))}
      </VStack>
    );
  }

  return (
    <>
      <ModalGeneral
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        propsModalContent={{ minWidth: { base: "", lg: "620px !important" } }}
      >
        <Stack spacing={0} marginBottom="16px">
          <TitleText marginRight="20px">
            {t('ui.thread.deleteTitle')}
          </TitleText>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{ backgroundColor: "transparent", opacity: 0.7 }}
            onClick={() => deleteModal.onClose()}
          />
        </Stack>

        <Stack spacing="24px" marginBottom="16px">
          <ExtraInfoTextForm>
            {t('ui.thread.deleteConfirm')}
          </ExtraInfoTextForm>
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
            {t('ui.cancel')}
          </Button>

          <Button
            width="100%"
            backgroundColor="#BF3434"
            _hover={{
              backgroundColor: "#992A2A",
            }}
            onClick={() => confirmDelete()}
            isLoading={isDeleting}
          >
            {t('ui.delete')}
          </Button>
        </Stack>
      </ModalGeneral>

      {hasHistoryContent && (
        <Box
          display="flex"
          flexDirection="column"
          flex="1"
          minHeight={0}
          width="100%"
          marginTop="16px"
        >
          <Box
            paddingX="16px"
            paddingY="8px"
            pointerEvents="none"
            flexShrink={0}
          >
            <BodyText
              color="#71757A"
              fontSize="11px"
              fontWeight="500"
              lineHeight="18px"
              letterSpacing="0.05em"
              textTransform="uppercase"
              whiteSpace="nowrap"
              height="18px"
              opacity={isSidebarOpen ? 0.9 : 0}
              transition="opacity 0.2s ease, transform 0.2s ease"
              transform={isSidebarOpen ? "translateX(0)" : "translateX(4px)"}
            >
              {t('ui.thread.historyTitle')}
            </BodyText>
          </Box>
          {error && isSidebarOpen && (
                <VStack
                  align="stretch"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing="0"
                  padding="8px"
                  maxHeight="100%"
                >
                  <BodyText
                    display="flex"
                    flexDirection="column"
                    typography="small"
                    color="#BF3434"
                    opacity={isSidebarOpen ? 1 : 0}
                    transition="opacity 0.2s ease, transform 0.2s ease"
                    transform={
                      isSidebarOpen ? "translateX(0)" : "translateX(4px)"
                    }
                  >
                    <span>{t('ui.thread.loadError')}</span>
                    <span>{t('ui.thread.tryAgain')}</span>
                  </BodyText>
                  <ReloadIcon
                    cursor="pointer"
                    width="20px"
                    height="20px"
                    _hover={{
                      opacity: 0.8,
                      transform: "rotate(360deg)",
                      transition: "opacity 0.2s ease, transform 0.8s ease",
                    }}
                    onClick={() => refetch()}
                  />
                </VStack>
              )}
          {!error && (
                <VStack
                  align="stretch"
                  spacing="2px"
                  flex="1"
                  minHeight={0}
                  overflowY={isSidebarOpen ? "auto" : "hidden"}
                  overflowX="hidden"
                  paddingX="8px"
                  sx={SCROLLBAR_SX}
                >
                  {sortedThreads.map((thread) => {
                    const isActive =
                      isSidebarOpen && currentThreadId === thread.id;
                    return (
                    <Box
                      position="relative"
                      role="group"
                      key={thread.id}
                      borderRadius="8px"
                      backgroundColor={isActive ? ACTIVE_BG : "transparent"}
                      pointerEvents={isSidebarOpen ? "auto" : "none"}
                      _hover={{
                        backgroundColor: isActive ? ACTIVE_BG_HOVER : "#EEEEEE",
                      }}
                    >
                      {isActive && (
                        <Box
                          aria-hidden
                          position="absolute"
                          left="0"
                          top="50%"
                          transform="translateY(-50%)"
                          width="3px"
                          height="16px"
                          borderRadius="full"
                          backgroundColor={ACTIVE_BAR}
                          zIndex={1}
                        />
                      )}
                      <Box
                        cursor="pointer"
                        display="flex"
                        alignItems="center"
                        padding="8px"
                        paddingRight={isSidebarOpen ? "34px" : "8px"}
                        onClick={() => handleSelectThread(thread)}
                      >
                        <BodyText
                          typography="small"
                          flex="1"
                          minWidth="0"
                          color="#464A51"
                          whiteSpace="nowrap"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          height="18px"
                          lineHeight="18px"
                          opacity={isSidebarOpen ? 1 : 0}
                          transition="opacity 0.2s ease, transform 0.2s ease"
                          transform={
                            isSidebarOpen ? "translateX(0)" : "translateX(4px)"
                          }
                          _groupHover={{
                            maskImage: THREAD_TITLE_FADE,
                            WebkitMaskImage: THREAD_TITLE_FADE,
                          }}
                        >
                          {thread.title}
                        </BodyText>
                      </Box>
                      {isSidebarOpen && (
                        <Menu placement="bottom-end" autoSelect={false} isLazy>
                          <MenuButton
                            as={Box}
                            aria-label={t('ui.thread.moreOptions')}
                            position="absolute"
                            right="6px"
                            top="50%"
                            transform="translateY(-50%)"
                            padding="5px"
                            lineHeight="0"
                            borderRadius="6px"
                            cursor="pointer"
                            color="#71757A"
                            opacity={0}
                            transition="opacity 0.15s ease"
                            sx={{
                              "@media (hover: none) and (pointer: coarse)": {
                                opacity: 1,
                              },
                            }}
                            _groupHover={{ opacity: 1 }}
                            _hover={{ backgroundColor: "#DEDFE0", color: "#252A32" }}
                            _expanded={{ opacity: 1, backgroundColor: "#DEDFE0", color: "#252A32" }}
                          >
                            <MoreVerticalIcon
                              display="block"
                              width="16px"
                              height="16px"
                              fill="currentColor"
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
                              onClick={(e) => handleDeleteClick(e, thread)}
                              borderRadius="6px"
                              padding="8px"
                              fontFamily="Roboto"
                              fontSize="14px"
                              lineHeight="20px"
                              color="#BF3434"
                              icon={
                                <TrashIcon width="16px" height="16px" fill="currentColor" />
                              }
                              _hover={{ backgroundColor: "#D03B3B", color: "#FFFFFF" }}
                              _focus={{ backgroundColor: "#D03B3B", color: "#FFFFFF" }}
                            >
                              {t('ui.thread.deleteAction')}
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      )}
                    </Box>
                    );
                  })}
                </VStack>
              )}
        </Box>
      )}
    </>
  );
};

