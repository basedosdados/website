import { useRef, useEffect, useLayoutEffect, useCallback, useState } from 'react';
import {
  Flex,
  VStack,
  Box,
  Textarea
} from "@chakra-ui/react";
import BodyText from "../../atoms/Text/BodyText";
import SendIcon from "../../../public/img/icons/sendIcon";

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function Search({
  value,
  onChange,
  onSend,
  isLoading,
  isGenerating,
  showDisclaimer = true,
}) {
  const textareaRef = useRef(null);
  const [isMultiLine, setIsMultiLine] = useState(false);

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
      const fullH = Math.min(el.scrollHeight, 400);
      el.style.height = `${fullH}px`;
      el.style.overflowY = fullH >= 400 ? 'scroll' : 'auto';
    } else {
      el.style.lineHeight = '38px';
      el.style.height = '38px';
      el.style.overflowY = 'hidden';
    }
  }, []);

  useIsoLayoutEffect(() => {
    adjustTextareaSizing(textareaRef.current, value);
  }, [value, adjustTextareaSizing]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (onSend) onSend();
    }
  };

  return (
    <VStack
      width="100%"
      maxWidth="760px"
      margin="auto auto 0"
      spacing="24px"
    >
      <Flex
        width="100%"
        borderRadius="14px"
        backgroundColor="#EEEEEE"
        padding="12px 16px"
        alignItems={isMultiLine ? 'flex-end' : 'center'}
        border="2px solid transparent !important"
        _hover={{
          border: "2px solid transparent !important",
          backgroundColor: "#DEDFE0",
        }}
        _focusWithin={{
          border: "2px solid #0068C5 !important",
          backgroundColor: "#FFF",
        }}
      >
        <Box flex={1} minWidth={0}>
          <Textarea
            id="search-chatbot"
            ref={textareaRef}
            disabled={isLoading || isGenerating}
            value={value}
            width="100%"
            onChange={(e) => {
              adjustTextareaSizing(e.target, e.target.value);
              if (onChange) onChange(e);
            }}
            onKeyDown={(e) => {
              if (!isLoading && !isGenerating) handleKeyDown(e);
            }}
            placeholder={
              isLoading || isGenerating
                ? "Aguarde a resposta..."
                : !showDisclaimer ? "Como posso ajudar você hoje?" : "Faça sua pergunta..."
            }
            variant="unstyled"
            minHeight="38px"
            maxHeight="400px"
            resize="none"
            padding="0"
            fontSize="16px"
            lineHeight={isMultiLine ? '26px' : '38px'}
            fontFamily="Roboto"
            fontWeight="400"
            color="#464A51"
            overflowY={isMultiLine ? 'auto' : 'hidden'}
            _placeholder={{
              color: "#464A51",
              fontSize: "14px",
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
          cursor="pointer"
          onClick={onSend}
          color="#464A51"
          opacity={isGenerating || !value ? 0.5 : 1}
          minWidth="24px"
          minHeight="24px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          pointerEvents={isGenerating || !value ? "none" : "auto"}
          transition="color 0.2s ease, fill 0.2s ease"
          _hover={{
            color: "#2B8C4D",
            fill: "#2B8C4D"
          }}
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
          width="100%"
          spacing={0}
          align="center"
          textAlign="center"
        >
          <BodyText
            typography="small"
            color="#ACAEB1"
          >
            O chatbot pode cometer erros. Considere verificar informações importantes.
          </BodyText>
          <BodyText
            typography="small"
            color="#ACAEB1"
          >
            Todas as informações aqui enviadas são registradas para análise e melhoria do produto.
          </BodyText>
        </VStack>
      )}
    </VStack>
  )
}
