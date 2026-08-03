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
import { redirectToChatbotCheckout } from "../utils";

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
  if (typeof window !== "undefined") {
    localStorage.setItem("previousPath", window.location.href);
  }
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
    let cancelled = false;

    async function checkAccess() {
      if (typeof window === "undefined") return;
      if (!hasCompleteAuthCookies()) {
        clearAuthCookiesAndRedirectLogin(router);
        return;
      }
      const token = cookies.get("token");
      try {
        const params = new URLSearchParams({ p: btoa(token) });
        const res = await fetch(`/api/user/validateToken?${params}`, {
          method: "GET"
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok || !data.success) {
          clearAuthCookiesAndRedirectLogin(router);
          return;
        }
        if (!data.has_chatbot_access) {
          await redirectToChatbotCheckout(router);
          return;
        }
        setCanEnter(true);
      } catch {
        if (!cancelled) clearAuthCookiesAndRedirectLogin(router);
      }
    }

    checkAccess();
    return () => {
      cancelled = true;
    };
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
  const resolvedInitialThread =
    router.isReady ? (normalizedThreadId ?? null) : undefined;
  const [scrollTrigger, setScrollTrigger] = useState(0);
  const skipFetchRef = useRef(false);
  const searchRef = useRef(null);

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
    syncThreadIdFromUrl,
    sendFeedback,
    exportQueryResult,
    resetChat
  } = useChatbot(resolvedInitialThread, {
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
    if (!normalizedThreadId) {
      skipFetchRef.current = false;
    }
  }, [normalizedThreadId]);

  useEffect(() => {
    if (!router.isReady) return;
    if (normalizedThreadId && normalizedThreadId !== threadId) {
      if (skipFetchRef.current) {
        skipFetchRef.current = false;
        return;
      }
      syncThreadIdFromUrl(normalizedThreadId);
    }
  }, [router.isReady, normalizedThreadId, threadId, syncThreadIdFromUrl]);

  const handleSend = useCallback((text) => {
    sendMessage(text);
    setScrollTrigger(prev => prev + 1);
  }, [sendMessage]);

  const handleFollowUpClick = useCallback((question) => {
    const trimmed = String(question || "").trim();
    if (!trimmed || isLoading || isGenerating) return;

    sendMessage(trimmed);
    setScrollTrigger(prev => prev + 1);
    searchRef.current?.clear();

    requestAnimationFrame(() => {
      searchRef.current?.focus();
    });
  }, [sendMessage, isLoading, isGenerating]);

  const handleNewChat = useCallback(() => {
    skipFetchRef.current = true;
    resetChat();
    router.push({
      pathname: router.pathname,
      query: {}
    }, undefined, { shallow: true });
  }, [resetChat, router]);

  const showNewChatGreeting =
    router.isReady && !normalizedThreadId && messages.length === 0;

  const searchField = (
    <Search
      ref={searchRef}
      threadId={threadId}
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
          currentThreadId={
            router.isReady ? normalizedThreadId : undefined
          }
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
                    onExport={exportQueryResult}
                    onFollowUpClick={handleFollowUpClick}
                    scrollTrigger={scrollTrigger}
                  />
                </Box>
                <Box
                  width="100%"
                  paddingTop="24px"
                  flexShrink={0}
                  overflowY="auto"
                  sx={{ scrollbarGutter: "stable" }}
                >
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