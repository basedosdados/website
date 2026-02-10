import {
  Flex,
  HStack,
  Stack,
  Box
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Sidebar from "../components/organisms/chatbot/Sidebar";
import Search from "../components/organisms/chatbot/Search";
import ChatWindow from "../components/organisms/chatbot/ChatWindow";
import useChatbot from "../hooks/useChatbot";

export default function Chatbot() {
  const router = useRouter();
  const { t: threadIdFromUrl } = router.query;
  const [value, setValue] = useState("");
  const {
    messages,
    isLoading,
    threadId,
    sendMessage,
    fetchThreadMessages,
    sendFeedback,
    resetChat
  } = useChatbot(threadIdFromUrl);

  useEffect(() => {
    if (threadIdFromUrl) {
      fetchThreadMessages(threadIdFromUrl);
    }
  }, [threadIdFromUrl, fetchThreadMessages]);

  useEffect(() => {
    if (!router.isReady) return;

    if (threadId && !threadIdFromUrl) {
      const { t, ...otherQuery } = router.query;
      router.push({
        pathname: router.pathname,
        query: { ...otherQuery, t: threadId }
      }, undefined, { shallow: true });
    }
  }, [threadId, threadIdFromUrl, router.isReady, router.pathname]);

  const handleSend = () => {
    if (value.trim() !== "") {
      sendMessage(value);
      setValue("");
    }
  };

  const handleNewChat = () => {
    resetChat();
    router.push({
      pathname: router.pathname,
      query: {}
    }, undefined, { shallow: true });
  };

  return (
    <HStack
      width="100%"
      minHeight="100vh"
      spacing={0}
    >
      <Head>
        <title>Chatbot - Basedosdados</title>
        <meta
          property="og:title"
          content="Chatbot - Basedosdados"
          key="ogtitle"
        />
        <meta
          property="og:description"
          content="Chatbot - Basedosdados"
          key="ogdesc"
        />
      </Head>
      <HStack
        spacing={0}
        width="100%"
        backgroundColor="#FFFFFF"
        height="100%"
        display="flex"
      >
        <Sidebar 
          onNewChat={handleNewChat} 
          currentThreadId={threadIdFromUrl}
        />
        <Flex
          flex={1}
          width="100%"
          height="100vh"
          padding="24px"
          overflow="hidden"
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          <Stack
            width="100%"
            height="100%"
            maxWidth="1440px"
            boxSizing="border-box"
            spacing={0}
            justify="center"
          >
            <Box flex={1} overflow="hidden" width="100%">
              <ChatWindow messages={messages} onFeedback={sendFeedback} />
            </Box>

            <Box width="100%" paddingTop="24px">
              <Search
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onSend={handleSend}
                isLoading={isLoading}
              />
            </Box>
          </Stack>
        </Flex>
      </HStack>
    </HStack>
  )
}