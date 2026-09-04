import {
  Flex,
  HStack,
  Stack,
  Box,
  Text
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
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
import HelpContent from "../components/organisms/chatbot/HelpContent";
import useChatbot from "../hooks/useChatbot";
import { ChatbotProvider } from "../context/ChatbotContext";
import ChatbotAccessGate from "../components/organisms/chatbot/ChatbotAccessGate";

const greetingFadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

function getUserEmailFromCookie() {
  try {
    const raw = cookies.get("userBD");
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?.email || null;
  } catch {
    return null;
  }
}

// Name from the email local-part's first segment, matching the reference:
// "victor.tornisiello@basedosdados.org" -> "Victor".
function nameFromEmail(email) {
  const rawName = email?.split("@")[0]?.split(".")[0] ?? "";
  return rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : "";
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// A time-of-day greeting, the user's name (from their email), and an optional
// follow-up line, picked at random — mirroring the reference chat's greeting.
// Re-rolls so the exact combination doesn't repeat on the next page load
// (`avoidSignature` is the previous load's signature).
function buildGreeting(t, avoidSignature) {
  const hour = new Date().getHours();
  const period =
    hour >= 5 && hour < 12
      ? "morning"
      : hour >= 12 && hour < 18
        ? "afternoon"
        : "evening";
  const name = nameFromEmail(getUserEmailFromCookie());
  // "Olá"/"Hello"/"Hola" is always in the pool, so it can surface at any hour.
  const greetingWords = [t(`ui.greetings.${period}`), t("ui.greetings.neutral")];
  const followups = t("ui.greetings.followups", { returnObjects: true });
  const followupList = Array.isArray(followups) ? followups : [""];

  // A handful of tries is more than enough to dodge one signature across the
  // available combinations; the loop is bounded so it always resolves.
  let result;
  for (let attempt = 0; attempt < 8; attempt++) {
    const greeting = pickRandom(greetingWords);
    const followup = pickRandom(followupList) || "";
    const base = name ? `${greeting}, ${name}` : greeting;
    const lead = `${base}.`;
    result = { lead, followup, signature: `${lead}|${followup}` };
    if (result.signature !== avoidSignature) break;
  }
  return result;
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

  const [greeting, setGreeting] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [composerHasText, setComposerHasText] = useState(false);

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

  const handleNewChat = useCallback(() => {
    skipFetchRef.current = true;
    resetChat();
    setShowHelp(false);
    setIsMobileSidebarOpen(false);
    router.push({
      pathname: router.pathname,
      query: {}
    }, undefined, { shallow: true });
  }, [resetChat, router]);

  const handleSelectThread = useCallback(() => {
    setShowHelp(false);
  }, []);

  const handleHelp = useCallback(() => {
    setShowHelp(true);
  }, []);

  const showNewChatGreeting =
    router.isReady && !normalizedThreadId && messages.length === 0;

  // Re-pick the greeting each time the new-chat view is entered — a fresh visit
  // to /chatbot, "new chat", or navigating back from a thread — not only on a
  // hard refresh. Skips the greeting shown on the previous visit so it doesn't
  // repeat two times in a row. Client-only (reads the clock, cookie, and rolls
  // at random), so it never runs during SSR/hydration.
  useEffect(() => {
    // Cleared while away so the next visit fades in fresh instead of flashing the
    // previous greeting (the component stays mounted across in-app navigation).
    if (!showNewChatGreeting) {
      setGreeting(null);
      return;
    }
    let previous = null;
    try {
      previous = window.localStorage.getItem("chatbot_last_greeting");
    } catch {}
    const next = buildGreeting(t, previous);
    setGreeting(next);
    try {
      window.localStorage.setItem("chatbot_last_greeting", next.signature);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNewChatGreeting]);

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
        <title>{showHelp ? t("help.head.pageTitle") : t("head.pageTitle")}</title>
        <meta
          property="og:title"
          content={showHelp ? t("help.head.pageTitle") : t("head.pageTitle")}
          key="ogtitle"
        />
        <meta
          property="og:description"
          content={showHelp ? t("help.head.pageTitle") : t("head.pageTitle")}
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
          onHelp={handleHelp}
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
            {showHelp ? (
              <HelpContent />
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
                {greeting && (
                  <Display
                    as="h2"
                    typography="small"
                    textAlign="center"
                    fontSize={{ base: "28px", md: "36px" }}
                    lineHeight={{ base: "36px", md: "48px" }}
                    paddingX={{ base: "8px", md: 0 }}
                    display="flex"
                    flexWrap="wrap"
                    justifyContent="center"
                    sx={{ columnGap: "8px" }}
                    animation={`${greetingFadeIn} 0.4s ease-out both`}
                  >
                    <Text as="span" whiteSpace="nowrap">
                      {greeting.lead}
                    </Text>
                    {greeting.followup ? (
                      <Text as="span" whiteSpace="nowrap">
                        {greeting.followup}
                      </Text>
                    ) : null}
                  </Display>
                )}
                <Box width="100%" flexShrink={0}>
                  {searchField}
                </Box>
                <OnboardingQuestions
                  onQuestionClick={handleFollowUpClick}
                  isDisabled={isLoading || isGenerating}
                  hasText={composerHasText}
                />
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