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
import BodyText from "../../atoms/Text/BodyText";
import SendIcon from "../../../public/img/icons/sendIcon";

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function draftKeyFor(threadId) {
  return `chatbot_draft_${threadId || 'new'}`;
}

const Search = forwardRef(function Search({
  threadId,
  onSend,
  isLoading,
  isGenerating,
  showDisclaimer = true,
}, ref) {
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

  useImperativeHandle(ref, () => ({
    clear: () => {
      localStorage.removeItem(draftKeyFor(threadId));
      setValue("");
    },
    focus: () => {
      textareaRef.current?.focus();
    },
  }), [threadId]);

  const adjustTextareaSizing = useCallback((el, rawText) => {
    if (!el) return;
    const text =
      rawText !== undefined && rawText !== null ? String(rawText) : el.value;

    el.style.minHeight = '0';
    el.style.height = '0';
    el.style.lineHeight = '26px';
    el.style.overflow = 'hidden';

    const collapsedScroll = el.scrollHeight;
    const multi =
      /\r?\n/.test(text) || collapsedScroll > 40;

    setIsMultiLine(multi);

    el.style.minHeight = '';
    el.style.height = '';
    el.style.overflow = '';

    if (multi) {
      el.style.lineHeight = '26px';
      el.style.height = 'auto';
      const maxH =
        typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
          ? 160
          : 400;
      const fullH = Math.min(el.scrollHeight, maxH);
      el.style.height = `${fullH}px`;
      el.style.overflowY = fullH >= maxH ? 'scroll' : 'auto';
    } else {
      el.style.lineHeight = '38px';
      el.style.height = '38px';
      el.style.overflowY = 'hidden';
    }
  }, []);

  useIsoLayoutEffect(() => {
    adjustTextareaSizing(textareaRef.current, value);
  }, [value, adjustTextareaSizing]);

  const isBusy = isLoading || isGenerating;

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
        borderRadius={{ base: "12px", md: "14px" }}
        backgroundColor="#EEEEEE"
        padding={{ base: "10px 12px", md: "12px 16px" }}
        alignItems={isMultiLine ? "flex-end" : "center"}
        border="2px solid transparent !important"
        cursor={isBusy ? "wait" : "text"}
        transition="background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease"
        aria-busy={isBusy}
        _hover={
          isBusy
            ? undefined
            : {
                border: "2px solid transparent !important",
                backgroundColor: "#DEDFE0",
              }
        }
        _focusWithin={
          isBusy
            ? undefined
            : {
                border: "2px solid #0068C5 !important",
                backgroundColor: "#FFF",
              }
        }
      >
        <Box flex={1} minWidth={0} position="relative">
          <Textarea
            id="search-chatbot"
            ref={textareaRef}
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
            placeholder={
              isBusy
                ? "Faça uma pergunta..."
                : !showDisclaimer
                  ? "Como posso ajudar você hoje?"
                  : "Faça uma pergunta..."
            }
            variant="unstyled"
            minHeight="38px"
            maxHeight={{ base: "160px", md: "400px" }}
            resize="none"
            padding="0"
            fontSize="16px"
            lineHeight={isMultiLine ? "26px" : "38px"}
            fontFamily="Roboto"
            fontWeight="400"
            color="#464A51"
            overflowY={isMultiLine ? "auto" : "hidden"}
            _placeholder={{
              color: "#464A51",
              fontSize: { base: "14px", md: "14px" },
              opacity: 1,
              lineHeight: isMultiLine ? "26px" : "38px",
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
        <Box
          flexShrink={0}
          marginLeft="8px"
          cursor={isBusy ? "wait" : "pointer"}
          onClick={triggerSend}
          color="#464A51"
          opacity={isBusy || !value ? 0.5 : 1}
          minWidth="40px"
          minHeight="40px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          pointerEvents={isBusy || !value ? "none" : "auto"}
          transition="color 0.2s ease, fill 0.2s ease, opacity 0.2s ease"
          _hover={
            isBusy
              ? undefined
              : {
                  color: "#2B8C4D",
                  fill: "#2B8C4D",
                }
          }
        >
          <SendIcon
            width="18px"
            height="18px"
            fill="currentColor"
            transform="rotate(45deg)"
          />
        </Box>
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
            O chatbot pode cometer erros. Considere verificar informações
            importantes.
          </BodyText>
          <BodyText typography="small" color="#ACAEB1">
            Todas as informações aqui enviadas são registradas para análise e
            melhoria do produto.
          </BodyText>
        </VStack>
      )}
    </VStack>
  );
});

export default Search;
