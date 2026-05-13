import {
  Flex,
  HStack,
  Stack,
  Box,
  Text
} from "@chakra-ui/react";
import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import cookies from "js-cookie";
import Sidebar from "../components/organisms/chatbot/Sidebar";
import Search from "../components/organisms/chatbot/Search";
import ChatWindow from "../components/organisms/chatbot/ChatWindow";
import Display from "../components/atoms/Text/Display";
import useChatbot from "../hooks/useChatbot";
import { ChatbotProvider } from "../context/ChatbotContext";
import { hasChatbotSubscription } from "../utils";

function getGreetingFirstNameFromCookie() {
  try {
    const raw = cookies.get("userBD");
    if (!raw) return null;
    const user = JSON.parse(raw);
    const name = user?.firstName;
    return name || null;
  } catch { 
    return null;
  }
}

function clearAuthCookiesAndRedirectLogin(router) {
  cookies.remove("userBD", { path: "/" });
  cookies.remove("token", { path: "/" });
  router.replace("/user/login");
}

function hasCompleteAuthCookies() {
  const token = cookies.get("token");
  const userRaw = cookies.get("userBD");
  if (!token || !String(token).trim()) return false;
  if (!userRaw || userRaw === "undefined") return false;
  try {
    JSON.parse(userRaw);
    return true;
  } catch {
    return false;
  }
}

function ChatbotAccessGate({ children }) {
  const router = useRouter();
  const [canEnter, setCanEnter] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasCompleteAuthCookies()) {
      clearAuthCookiesAndRedirectLogin(router);
      return;
    }
    try {
      const user = JSON.parse(cookies.get("userBD"));
      if (!hasChatbotSubscription(user)) {
        router.replace("/prices");
        return;
      }
    } catch {
      clearAuthCookiesAndRedirectLogin(router);
      return;
    }
    setCanEnter(true);
  }, [router]);

  if (!canEnter) return null;
  return children;
}

function ChatbotContent() {
  const router = useRouter();
  const { t: threadIdFromUrl } = router.query;
  const normalizedThreadId = Array.isArray(threadIdFromUrl)
    ? threadIdFromUrl[0]
    : threadIdFromUrl;
  const [value, setValue] = useState("");
  const [scrollTrigger, setScrollTrigger] = useState(0);
  const skipFetchRef = useRef(false);

  const [greetingFirstName, setGreetingFirstName] = useState(null);

  useEffect(() => {
    setGreetingFirstName(getGreetingFirstNameFromCookie());
  }, []);

  const {
    messages,
    isLoading,
    isGenerating,
    threadId,
    sendMessage,
    fetchThreadMessages,
    sendFeedback,
    resetChat
  } = useChatbot(normalizedThreadId ?? null, {
    onThreadCreated: (id) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, t: id }
      }, undefined, { shallow: true });
    }
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const busy = isLoading || isGenerating;
    document.body.style.cursor = busy ? "wait" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [isLoading, isGenerating]);

  useEffect(() => {
    if (normalizedThreadId && normalizedThreadId !== threadId) {
      if (skipFetchRef.current) {
        skipFetchRef.current = false;
        return;
      }
      fetchThreadMessages(normalizedThreadId);
    }
  }, [normalizedThreadId, threadId, fetchThreadMessages]);

  useEffect(() => {
    const draftKey = `chatbot_draft_${threadId || 'new'}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      setValue(savedDraft);
    } else {
      setValue("");
    }
  }, [threadId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const draftKey = `chatbot_draft_${threadId || 'new'}`;
      if (value) {
        localStorage.setItem(draftKey, value);
      } else {
        localStorage.removeItem(draftKey);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [value, threadId]);

  const handleSend = useCallback(() => {
    if (value.trim() !== "") {
      sendMessage(value);
      setScrollTrigger(prev => prev + 1);
      setValue("");
      const draftKey = `chatbot_draft_${threadId || 'new'}`;
      localStorage.removeItem(draftKey);
    }
  }, [value, sendMessage, threadId]);

  const handleNewChat = useCallback(() => {
    skipFetchRef.current = true;
    resetChat();
    router.push({
      pathname: router.pathname,
      query: {}
    }, undefined, { shallow: true });
  }, [resetChat, router]);

  const showNewChatGreeting = !normalizedThreadId && messages.length === 0;

  const searchField = (
    <Search
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onSend={handleSend}
      isLoading={isLoading}
      isGenerating={isGenerating}
      showDisclaimer={!showNewChatGreeting}
    />
  );

  return (
    <HStack width="100%" minHeight="100vh" spacing={0}>
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
          currentThreadId={normalizedThreadId}
          isGenerating={isGenerating}
        />
        <Flex
          flex={1}
          width="100%"
          height="100vh"
          padding="24px"
          overflow="hidden"
          justifyContent="center"
          alignItems="stretch"
          position="relative"
        >
          <Stack
            width={{ base: "100%", md: "800px" }}
            height="100%"
            maxWidth="1440px"
            boxSizing="border-box"
            spacing={0}
            flex={1}
            minHeight={0}
          >
            {showNewChatGreeting ? (
              <Flex
                flex={1}
                width="100%"
                minHeight={0}
                direction="column"
                align="center"
                justify="center"
                paddingX={{ base: "16px", md: "32px" }}
                gap={{ base: "24px", md: "32px" }}
              >
                <Display as="h2" typography="small" textAlign="center">
                  Olá,
                  <Text
                    as="span"
                    textTransform="capitalize"
                    marginLeft="8px"
                  >
                    {greetingFirstName
                      ? greetingFirstName
                      : "Como posso ajudar você hoje?"}
                  </Text>
                </Display>
                <Box width="100%" flexShrink={0}>
                  {searchField}
                </Box>
              </Flex>
            ) : (
              <>
                <Box flex={1} overflow="hidden" width="100%" minHeight={0}>
                  <ChatWindow
                    messages={messages}
                    onFeedback={sendFeedback}
                    scrollTrigger={scrollTrigger}
                  />
                </Box>
                <Box width="100%" paddingTop="24px" flexShrink={0}>
                  {searchField}
                </Box>
              </>
            )}
          </Stack>
        </Flex>
      </HStack>
    </HStack>
  );
}

export default function Chatbot() {
  return (
    <ChatbotAccessGate>
      <ChatbotProvider>
        <ChatbotContent />
      </ChatbotProvider>
    </ChatbotAccessGate>
  );
}