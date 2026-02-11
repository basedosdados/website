import { useRef, useEffect } from 'react';
import {
  Flex,
  VStack,
  Box,
  Textarea
} from "@chakra-ui/react";
import BodyText from "../../atoms/Text/BodyText";
import SendIcon from "../../../public/img/icons/sendIcon";
import StopIcon from "../../../public/img/icons/stopIcon";

export default function Search({ value, onChange, onSend, onStop, isLoading, isGenerating }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (onSend) onSend();
    }
  };

  return (
    <VStack
      width="100%"
      maxWidth="600px"
      margin="auto auto 0"
      spacing="24px"
    >
      <Flex
        width="100%"
        borderRadius="14px"
        backgroundColor="#EEEEEE"
        padding="12px 16px"
        alignItems="flex-end"
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
        <Textarea
          id="search-chatbot"
          ref={textareaRef}
          disabled={isLoading || isGenerating}
          value={value}
          onChange={(e) => {
            e.target.style.height = '24px'; 
            e.target.style.height = `${e.target.scrollHeight}px`;
            if (onChange) onChange(e);
          }}
          onKeyDown={(e) => {
            if (!isLoading && !isGenerating) handleKeyDown(e);
          }}
          placeholder={isLoading || isGenerating ? "Aguarde a resposta..." : "Faça sua pergunta!"}
          variant="unstyled"
          width="100%"
          minHeight="24px"
          maxHeight="400px"
          resize="none"
          padding="0"
          fontSize="14px"
          lineHeight="24px"
          fontFamily="Roboto"
          fontWeight="400"
          color="#464A51"
          overflowY="auto"
          _placeholder={{
            color: "#464A51",
            fontSize: "14px",
            opacity: 1
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
        <Box
          marginLeft="8px"
          cursor="pointer"
          onClick={isGenerating ? onStop : onSend}
          color={isGenerating ? "#FF4D4D" : "#464A51"}
          opacity={isGenerating || value ? 1 : 0.5}
          minWidth="24px"
          minHeight="24px"
          element="div"
          display="flex"
          alignItems="center"
          justifyContent="center"
          pointerEvents={isGenerating || value ? "auto" : "none"}
          transition="color 0.2s ease, fill 0.2s ease"
          _hover={{
            color: isGenerating ? "#FF0000" : "#2B8C4D",
            fill: isGenerating ? "#FF0000" : "#2B8C4D"
          }}
        >
          {isGenerating ? (
            <StopIcon
              width="24px"
              height="24px"
              fill="currentColor"
            />
          ) : (
            <SendIcon
              width="18px"
              height="18px"
              fill="currentColor"
              transform="rotate(45deg)"
            />
          )}
        </Box>
      </Flex>

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
    </VStack>
  )
}
