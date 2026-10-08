import {
  Flex,
  HStack,
  Stack,
  Box,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Sidebar from "../components/organisms/chatbot/Sidebar";
import Search from "../components/organisms/chatbot/Search";
import ChatWindow from "../components/organisms/chatbot/ChatWindow";
import OnboardingQuestions from "../components/organisms/chatbot/OnboardingQuestions";
import ThreadHeader from "../components/organisms/chatbot/ThreadHeader";
import Display from "../components/atoms/Text/Display";
import { SidebarIcon, CrossIcon } from "../components/organisms/chatbot/Icons";
import BrandLogo from "../components/organisms/chatbot/BrandLogo";
import AboutContent from "../components/organisms/chatbot/AboutContent";
import useChatbot from "../hooks/useChatbot";
import { ChatbotProvider } from "../context/ChatbotContext";
import ChatbotAccessGate from "../components/organisms/chatbot/ChatbotAccessGate";

const greetingFadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

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

  const [showAbout, setShowAbout] = useState(false);
  const [composerHasText, setComposerHasText] = useState(false);
  const scrollDirectionRef = useRef(null);

  const handleComposerTextChange = useCallback((text) => {
    setComposerHasText((text || "").trim().length > 0);
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

  const handleIdeaPrompt = useCallback((question) => {
    const trimmed = String(question || "").trim();
    if (!trimmed || isLoading || isGenerating) return;

    searchRef.current?.setText(trimmed);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        searchRef.current?.focus();
      });
    });
  }, [isLoading, isGenerating]);

  const handleScrollDirection = useCallback((direction) => {
    scrollDirectionRef.current?.(direction);
  }, []);

  const handleNewChat = useCallback(() => {
    skipFetchRef.current = true;
    resetChat();
    setShowAbout(false);
    setIsMobileSidebarOpen(false);
    router.push({
      pathname: router.pathname,
      query: {}
    }, undefined, { shallow: true });
  }, [resetChat, router]);

  const handleSelectThread = useCallback(() => {
    setShowAbout(false);
  }, []);

  const handleAbout = useCallback(() => {
    setShowAbout(true);
  }, []);

  const showNewChatGreeting =
    router.isReady && !normalizedThreadId && messages.length === 0;
  const isThreadView = !showAbout && !showNewChatGreeting;

  const searchField = (
    <Search
      ref={searchRef}
      threadId={threadId}
      onSend={handleSend}
      isGenerating={isGenerating}
      showDisclaimer={!showNewChatGreeting}
      onTextChange={handleComposerTextChange}
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
        <title>{showAbout ? t("about.head.pageTitle") : t("head.pageTitle")}</title>
        <meta
          property="og:title"
          content={showAbout ? t("about.head.pageTitle") : t("head.pageTitle")}
          key="ogtitle"
        />
        <meta
          property="og:description"
          content={showAbout ? t("about.head.pageTitle") : t("head.pageTitle")}
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
          onSelectThread={handleSelectThread}
          onAbout={handleAbout}
          currentThreadId={
            showAbout || !router.isReady ? undefined : normalizedThreadId
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
          padding={{
            base: "12px 12px 16px",
            md: isThreadView ? 0 : "24px 0",
          }}
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
            {showAbout ? (
              <AboutContent />
            ) : showNewChatGreeting ? (
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
                  animation={`${greetingFadeIn} 0.4s ease-out both`}
                >
                  {t("ui.greeting")}
                </Display>
                <Box width="100%" flexShrink={0}>
                  {searchField}
                </Box>
                <OnboardingQuestions
                  onQuestionClick={handleIdeaPrompt}
                  isDisabled={isLoading || isGenerating}
                  hasText={composerHasText}
                />
              </Flex>
            ) : (
              <>
                <Box
                  position="relative"
                  flex={1}
                  overflow="hidden"
                  width="100%"
                  minHeight={0}
                  minWidth={0}
                >
                  <ThreadHeader
                    scrollDirectionRef={scrollDirectionRef}
                    threadId={threadId || normalizedThreadId}
                    messages={messages}
                    onDeleted={handleNewChat}
                    onQuestionClick={handleIdeaPrompt}
                    isDisabled={isLoading || isGenerating}
                  />
                  <ChatWindow
                    messages={messages}
                    onFeedback={sendFeedback}
                    onExport={exportQueryResult}
                    onFollowUpClick={handleFollowUpClick}
                    scrollTrigger={scrollTrigger}
                    onScrollDirection={handleScrollDirection}
                  />
                </Box>
                <Box
                  width="100%"
                  padding={{ base: "12px 0", md: "24px 0" }}
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
