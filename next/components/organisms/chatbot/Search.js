import {
  forwardRef,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useState,
  useImperativeHandle,
} from 'react';
import {
  Flex,
  VStack,
  Box,
  Textarea,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import BodyText from "../../atoms/Text/BodyText";
import ArrowUpIcon from "../../../public/img/icons/arrowUpIcon";

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function draftKeyFor(threadId) {
  return `chatbot_draft_${threadId || 'new'}`;
}

const Search = forwardRef(function Search({
  threadId,
  onSend,
  isGenerating,
  showDisclaimer = true,
  onTextChange,
}, ref) {
  const { t } = useTranslation("chatbot");
  const textareaRef = useRef(null);
  const [isMultiLine, setIsMultiLine] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    const savedDraft = localStorage.getItem(draftKeyFor(threadId));
    setValue(savedDraft || "");
  }, [threadId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const key = draftKeyFor(threadId);
      if (value) {
        localStorage.setItem(key, value);
      } else {
        localStorage.removeItem(key);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [value, threadId]);

  // Surface the current text so the caller can react to it (e.g. slide the
  // onboarding cards out of the way once the user starts writing).
  useEffect(() => {
    onTextChange?.(value);
  }, [value, onTextChange]);

  useImperativeHandle(ref, () => ({
    clear: () => {
      localStorage.removeItem(draftKeyFor(threadId));
      setValue("");
    },
    focus: () => {
      textareaRef.current?.focus();
    },
  }), [threadId]);

  // Auto-grow with a constant 24px line-height and the padding baked into the
  // textarea (matching the reference composer's box model): one row is
  // 24px line + 28px vertical padding = 52px; it grows a row at a time up to the
  // max, then scrolls.
  const adjustTextareaSizing = useCallback((el, rawText) => {
    if (!el) return;
    const text =
      rawText !== undefined && rawText !== null ? String(rawText) : el.value;

    el.style.height = 'auto';
    const maxH =
      typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
        ? 160
        : 400;
    const fullH = Math.min(el.scrollHeight, maxH);
    el.style.height = `${fullH}px`;
    el.style.overflowY = el.scrollHeight > maxH ? 'auto' : 'hidden';

    // Past a single row, pin the send button to the bottom.
    setIsMultiLine(/\r?\n/.test(text) || el.scrollHeight > 64);
  }, []);

  useIsoLayoutEffect(() => {
    adjustTextareaSizing(textareaRef.current, value);
  }, [value, adjustTextareaSizing]);

  // Busy only while a response is generating — loading a thread's history must
  // not disable the composer (that caused a "blink" on every thread open).
  const isBusy = isGenerating;
  // Send button pops from a muted chip to filled brand green the moment there's
  // something to send.
  const hasText = value.trim().length > 0;
  const isSendActive = hasText && !isBusy;

  const triggerSend = useCallback(() => {
    if (isBusy) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    localStorage.removeItem(draftKeyFor(threadId));
    setValue("");
    onSend?.(trimmed);
  }, [isBusy, value, onSend, threadId]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      triggerSend();
    }
  };

  return (
    <VStack
      width="100%"
      maxWidth="760px"
      margin="auto auto 0"
      spacing={{ base: "12px", md: "24px" }}
      minWidth={0}
    >
      <Flex
        width="100%"
        borderRadius={{ base: "14px", md: "16px" }}
        backgroundColor="#FFFFFF"
        padding="8px"
        alignItems={isMultiLine ? "flex-end" : "center"}
        border="1px solid #E5E7EB"
        boxShadow="0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 1px 3px -1px rgba(0, 0, 0, 0.06)"
        cursor={isBusy ? "wait" : "text"}
        transition="border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, opacity 0.2s ease"
        aria-busy={isBusy}
        _hover={
          isBusy
            ? undefined
            : {
                borderColor: "#D5D8DC",
              }
        }
        _focusWithin={
          isBusy
            ? undefined
            : {
                borderColor: "#2B8C4D",
                boxShadow:
                  "0 0 0 3px rgba(43, 140, 77, 0.15), 0 1px 3px -1px rgba(0, 0, 0, 0.06)",
                backgroundColor: "#FFFFFF",
              }
        }
      >
        <Box flex={1} minWidth={0} position="relative">
          <Textarea
            id="search-chatbot"
            ref={textareaRef}
            rows={1}
            disabled={isBusy}
            value={value}
            width="100%"
            onChange={(e) => {
              setValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (!isBusy) handleKeyDown(e);
            }}
            opacity={isBusy ? 0.22 : 1}
            transition="opacity 0.2s ease"
            placeholder={t("ui.search.placeholder")}
            variant="unstyled"
            minHeight="52px"
            maxHeight={{ base: "160px", md: "400px" }}
            resize="none"
            padding="14px 12px"
            fontSize="16px"
            lineHeight="24px"
            fontFamily="Roboto"
            fontWeight="400"
            color="#464A51"
            overflowY="hidden"
            _placeholder={{
              color: "#464A51",
              fontSize: "14px",
              opacity: 1,
              lineHeight: "24px",
            }}
            css={{
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-track": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#C4C4C4",
                borderRadius: "24px",
              },
            }}
          />
        </Box>
        <Flex
          as="button"
          type="button"
          aria-label={t("ui.send")}
          disabled={!isSendActive}
          flexShrink={0}
          marginLeft="8px"
          width="36px"
          height="36px"
          borderRadius="12px"
          alignItems="center"
          justifyContent="center"
          onClick={triggerSend}
          backgroundColor={isSendActive ? "#2B8C4D" : "#EEEEEE"}
          color={isSendActive ? "#FFFFFF" : "#71757A"}
          boxShadow={
            isSendActive
              ? "0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 1px 3px -1px rgba(0, 0, 0, 0.06)"
              : "none"
          }
          opacity={isBusy ? 0.5 : 1}
          cursor={isSendActive ? "pointer" : "default"}
          pointerEvents={isSendActive ? "auto" : "none"}
          transition="background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease"
          _hover={isSendActive ? { backgroundColor: "#22703E" } : undefined}
        >
          <ArrowUpIcon width="16px" height="16px" />
        </Flex>
      </Flex>

      {showDisclaimer && (
        <VStack
          display={{ base: "none", md: "flex" }}
          width="100%"
          spacing={0}
          align="center"
          textAlign="center"
        >
          <BodyText typography="small" color="#ACAEB1">
            {t("ui.search.disclaimer")}
          </BodyText>
          <BodyText typography="small" color="#ACAEB1">
            {t("ui.search.disclaimerPrivacy")}
          </BodyText>
        </VStack>
      )}
    </VStack>
  );
});

export default Search;
