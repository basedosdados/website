import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  VStack,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
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
import TrashIcon from '../../../public/img/icons/trashIcon';
import ReloadIcon from '../../../public/img/icons/reloadIcon';

export default function ThreadList({ onSelectThread, currentThreadId, isSidebarOpen, isGenerating, onNewChat }) {
  const router = useRouter();
  const { threads, isLoading, error, refetch, deleteThread, isDeleting } = useChatbotContext();
  const deleteModal = useDisclosure();
  const [threadToDelete, setThreadToDelete] = useState(null);

  const handleSelectThread = (thread) => {
    if (isGenerating) return;

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
          <TitleText marginRight="20px">Confirmar exclusão de conversa</TitleText>
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
            Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.
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
              borderColor: "#992A2A"
            }}
            onClick={() => deleteModal.onClose()}
          >
            Cancelar
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
            Excluir
          </Button>
        </Stack>
      </ModalGeneral>

      <Accordion
        display="flex"
        allowToggle={isSidebarOpen}
        index={isSidebarOpen ? undefined : [0]}
        defaultIndex={[0]}
        width="100%"
        marginTop="16px"
      >
        <AccordionItem border="none" width="100%">
          <AccordionButton
            padding="8px"
            cursor={isSidebarOpen ? "pointer" : "default"}
            _hover={{ backgroundColor: "transparent" }}
            _focus={{ boxShadow: "none" }}
            display="flex"
            justifyContent="space-between"
            width="100%"
            pointerEvents={isSidebarOpen ? "auto" : "none"}
          >
            <BodyText
              typography="small"
              color="currentColor"
              whiteSpace="nowrap"
              height="18px"
              lineHeight="18px"
              width={isSidebarOpen ? "auto" : "0"}
              opacity={isSidebarOpen ? 1 : 0}
              transition="opacity 0.2s ease, transform 0.2s ease, width 0.2s ease"
              transform={isSidebarOpen ? "translateX(0)" : "translateX(4px)"}
            >
              Conversas
            </BodyText>
            {isSidebarOpen && threads.length > 0 && <AccordionIcon color="#252A32" />}
          </AccordionButton>
          <AccordionPanel padding="0">
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
                  width={isSidebarOpen ? "auto" : "0"}
                  opacity={isSidebarOpen ? 1 : 0}
                  transition="opacity 0.2s ease, transform 0.2s ease, width 0.2s ease"
                  transform={isSidebarOpen ? "translateX(0)" : "translateX(4px)"}
                >
                  <span>Erro ao carregar histórico.</span>
                  <span>Tente novamente.</span>
                </BodyText>
                <ReloadIcon
                  cursor="pointer"
                  width="20px"
                  height="20px"
                  _hover={{
                    opacity: 0.8,
                    transform: "rotate(360deg)",
                    transition: "opacity 0.2s ease, transform 0.8s ease"
                  }}
                  onClick={() => refetch()}
                />
              </VStack>
            )}
            {!error && (
              <VStack
                align="stretch"
                spacing="0"
                overflowY="auto"
                maxHeight="100%"
              >
              {threads?.map((thread) => (
                <Box
                  position="relative"
                  role="group"
                  cursor="pointer"
                  key={thread.id}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  padding="8px"
                  borderRadius="8px"
                  gap={isSidebarOpen ? "4px" : "0"}
                  onClick={() => handleSelectThread(thread)}
                  backgroundColor={isSidebarOpen && currentThreadId === thread.id ? "#EEEEEE" : "transparent"}
                  pointerEvents={isSidebarOpen && !isGenerating ? "auto" : "none"}
                  _hover={{
                    color: "#2B8C4D",
                    fill: "#2B8C4D",
                    backgroundColor: "#EEEEEE"
                  }}
                >
                  <BodyText
                    typography="small"
                    color={currentThreadId === thread.id ? "#2B8C4D" : "currentColor"}
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    height="18px"
                    lineHeight="18px"
                    width={isSidebarOpen ? "auto" : "0"}
                    opacity={isSidebarOpen ? 1 : 0}
                    transition="opacity 0.2s ease, transform 0.2s ease, width 0.2s ease"
                    transform={isSidebarOpen ? "translateX(0)" : "translateX(4px)"}
                  >
                    {thread.title}
                  </BodyText>
                  {isSidebarOpen && (
                    <TrashIcon
                      position="absolute"
                      top="8px"
                      right="8px"
                      display="none"
                      _groupHover={{ display: "block" }}
                      width="18px"
                      height="18px"
                      fill="#ACAEB1"
                      cursor="pointer"
                      onClick={(e) => handleDeleteClick(e, thread)}
                      _hover={{
                        color: "#BF3434",
                        fill: "#BF3434",
                      }}
                    />
                  )}
                </Box>
              ))}
              </VStack>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

