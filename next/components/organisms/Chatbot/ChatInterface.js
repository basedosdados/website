import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Box, VStack, HStack, Input, Button, Text, Spinner, Alert, AlertIcon, Flex } from "@chakra-ui/react";
import ChatPage from "./ChatPage";
import ChatHistory from "./ChatHistory";
import BodyText from "../../atoms/Text/BodyText";
import TitleText from "../../atoms/Text/TitleText";

export default function ChatInterface({ onNewThread, onThreadActivity }) {
  const { t } = useTranslation('chatbot');
  const router = useRouter();
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [selectedThreadTitle, setSelectedThreadTitle] = useState(null);
  const [chatHistoryFunctions, setChatHistoryFunctions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [focusInput, setFocusInput] = useState(false);

  // Handle thread selection
  const handleThreadSelect = useCallback((threadId) => {
    setSelectedThreadId(threadId);
    setSelectedThreadTitle(null); // Will be loaded by ChatPage
    setError(null);
  }, []);

  // Handle thread updates (activity tracking)
  const handleThreadUpdate = useCallback((threadId) => {
    if (chatHistoryFunctions?.updateThreadActivity) {
      chatHistoryFunctions.updateThreadActivity(threadId);
    }
    if (onThreadActivity) {
      onThreadActivity(threadId);
    }
  }, [chatHistoryFunctions, onThreadActivity]);

  // Handle new thread creation
  const handleNewThread = useCallback((threadId, title) => {
    setSelectedThreadId(threadId);
    setSelectedThreadTitle(title);
    
    // Add to chat history
    if (chatHistoryFunctions?.addNewThread) {
      chatHistoryFunctions.addNewThread(threadId, title);
    }
    
    if (onNewThread) {
      onNewThread(threadId, title);
    }
  }, [chatHistoryFunctions, onNewThread]);

  // Handle thread deletion
  const handleDeleteThread = useCallback((threadId) => {
    if (selectedThreadId === threadId) {
      setSelectedThreadId(null);
      setSelectedThreadTitle(null);
    }
  }, [selectedThreadId]);

  // Expose chat history functions
  const handleChatHistoryFunctions = useCallback((functions) => {
    setChatHistoryFunctions(functions);
  }, []);

  // Handle new conversation button click
  const handleNewConversation = useCallback(() => {
    setSelectedThreadId(null);
    setSelectedThreadTitle(null);
    setError(null);
    setFocusInput(true);
  }, []);

  // Reset focus input flag after it's been used
  const handleFocusInputUsed = useCallback(() => {
    setFocusInput(false);
  }, []);

  // Handle documentation button click
  const handleReadDocs = useCallback(() => {
    router.push('/docs/bot');
  }, [router]);

  return (
    <VStack spacing={6} align="stretch" height="100%">
      {/* Header */}
      <Box>
        <HStack justify="space-between" align="flex-start">
          <Box>
            <TitleText typography="large" fontWeight="600" color="#252A32">
              {t('title')}
            </TitleText>
            <BodyText typography="medium" color="#616161" marginTop="8px">
              {t('subtitle')}
            </BodyText>
          </Box>
        </HStack>
      </Box>

      <Box marginTop="12px">
        <Button
          onClick={handleReadDocs}
          color="#3182CE"
          _hover={{ backgroundColor: "#E6F3FF" }}
          size="sm"
        >
          {t('documentation.read_docs')}
        </Button>
      </Box>

      {/* Chat Interface */}
      <Flex height="calc(100% - 160px)" width="100%" overflow="hidden">
        {/* Chat History Sidebar */}
        <Box
          width="280px"
          minWidth="280px"
          height="100%"
          borderRight="1px solid #E2E8F0"
          backgroundColor="#FAFAFA"
          display="flex"
          flexDirection="column"
        >
          <ChatHistory
            selectedThreadId={selectedThreadId}
            onThreadSelect={handleThreadSelect}
            onThreadUpdate={handleThreadUpdate}
            onFunctions={handleChatHistoryFunctions}
          />
        </Box>

        {/* Main Chat Area */}
        <Box flex={1} height="100%" display="flex" flexDirection="column" position="relative" maxWidth="calc(100% - 280px)">
          {/* Error Alert */}
          {error && (
            <Alert status="error" borderRadius="0" margin={0}>
              <AlertIcon />
              {error}
            </Alert>
          )}

          {/* Chat Page */}
          <Box flex={1} height="100%" overflow="hidden">
          <ChatPage
            threadId={selectedThreadId}
            threadTitle={selectedThreadTitle}
            onThreadUpdate={handleThreadUpdate}
            onDeleteThread={handleDeleteThread}
            onNewThread={handleNewThread}
            focusInput={focusInput}
            onFocusInputUsed={handleFocusInputUsed}
          />
        </Box>
      </Box>
      </Flex>
    </VStack>
  );
}
