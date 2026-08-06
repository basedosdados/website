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
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import cookies from "js-cookie";
import Sidebar from "../components/organisms/chatbot/Sidebar";
import Search from "../components/organisms/chatbot/Search";
import ChatWindow from "../components/organisms/chatbot/ChatWindow";
import OnboardingQuestions from "../components/organisms/chatbot/OnboardingQuestions";
import Display from "../components/atoms/Text/Display";
import SidebarIcon from "../public/img/icons/sidebarIcon";
import CrossIcon from "../public/img/icons/crossIcon";
import BrandLogo from "../components/organisms/chatbot/BrandLogo";
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
  const { t } = useTranslation("chatbot");
  const { t: threadIdFromUrl } = router.query;
  const normalizedThreadId = Array.isArray(threadIdFromUrl)
    ? threadIdFromUrl[0]
    : threadIdFromUrl;
  const resolvedInitialThread =
    router.isReady ? (normalizedThreadId ?? null) : undefined;
  const [scrollTrigger, setScrollTrigger] = useState(0);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const skipFetchRef = useRef(false);
  const searchRef = useRef(null);

  const [greetingFirstName, setGreetingFirstName] = useState(null);

  useEffect(() => {
    setGreetingFirstName(getGreetingFirstNameFromCookie());
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!isMobileSidebarOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMobileSidebarOpen]);

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
    setIsMobileSidebarOpen(false);
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

  const mobileHeader = (
    <Flex
      display={{ base: "flex", md: "none" }}
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      flexShrink={0}
      paddingBottom="12px"
      gap="8px"
    >
      <Box
        as="button"
        type="button"
        aria-label={t("ui.openMenu")}
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="40px"
        height="40px"
        borderRadius="8px"
        color="#252A32"
        flexShrink={0}
        onClick={() => setIsMobileSidebarOpen(true)}
        _hover={{ backgroundColor: "#EEEEEE", color: "#2B8C4D" }}
      >
        <SidebarIcon width="20px" height="20px" />
      </Box>

      <BrandLogo widthImage="48px" heightImage="21px" />

      <Box
        as="button"
        type="button"
        aria-label={t("ui.newChat")}
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="40px"
        height="40px"
        borderRadius="8px"
        color="#252A32"
        flexShrink={0}
        onClick={handleNewChat}
        _hover={{ backgroundColor: "#EEEEEE", color: "#2B8C4D" }}
      >
        <Box
          width="22px"
          height="22px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="50%"
          backgroundColor="#DEDFE0"
          transform="rotate(45deg)"
        >
          <CrossIcon width="11px" height="11px" fill="currentColor" aria-hidden />
        </Box>
      </Box>
    </Flex>
  );

  return (
    <HStack width="100%" minHeight="100dvh" spacing={0} align="stretch">
      <Head>
        <title>{t("head.pageTitle")}</title>
        <meta
          property="og:title"
          content={t("head.pageTitle")}
          key="ogtitle"
        />
        <meta
          property="og:description"
          content={t("head.pageTitle")}
          key="ogdesc"
        />
      </Head>
      <HStack
        spacing={0}
        width="100%"
        backgroundColor="#FFFFFF"
        minHeight="100dvh"
        height="100dvh"
        maxHeight="100dvh"
        display="flex"
        align="stretch"
        overflow="hidden"
      >
        <Sidebar
          onNewChat={handleNewChat}
          currentThreadId={
            router.isReady ? normalizedThreadId : undefined
          }
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        <Flex
          flex={1}
          width="100%"
          minWidth={0}
          height="100%"
          maxHeight="100dvh"
          padding={{ base: "12px 12px 16px", md: "24px" }}
          overflow="hidden"
          justifyContent="center"
          alignItems="stretch"
          position="relative"
          direction="column"
        >
          {mobileHeader}
          <Stack
            width="100%"
            height="100%"
            boxSizing="border-box"
            spacing={0}
            flex={1}
            minHeight={0}
            minWidth={0}
            marginX="auto"
          >
            {showNewChatGreeting ? (
              <Flex
                flex={1}
                width="100%"
                minHeight={0}
                direction="column"
                align="center"
                justify="center"
                paddingX={{ base: "0", md: "32px" }}
                gap={{ base: "20px", md: "32px" }}
              >
                <Display
                  as="h2"
                  typography="small"
                  textAlign="center"
                  fontSize={{ base: "28px", md: "36px" }}
                  lineHeight={{ base: "36px", md: "48px" }}
                  paddingX={{ base: "8px", md: 0 }}
                >
                  {t("ui.greetingPrefix")}
                  <Text
                    as="span"
                    textTransform="capitalize"
                    marginLeft="8px"
                  >
                    {greetingFirstName
                      ? greetingFirstName
                      : t("ui.helpQuestion")}
                  </Text>
                </Display>
                <Box width="100%" flexShrink={0}>
                  {searchField}
                </Box>
                {/* <OnboardingQuestions
                  onQuestionClick={handleFollowUpClick}
                  isDisabled={isLoading || isGenerating}
                /> */}
              </Flex>
            ) : (
              <>
                <Box flex={1} overflow="hidden" width="100%" minHeight={0} minWidth={0}>
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
                  paddingTop={{ base: "12px", md: "24px" }}
                  flexShrink={0}
                  overflowY="auto"
                  sx={{
                    scrollbarGutter: "stable",
                    "@media (max-width: 767px)": {
                      scrollbarGutter: "auto",
                    },
                  }}
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

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "menu", "chatbot"])),
    },
  };
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