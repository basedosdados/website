import {
  Box,
  Flex,
  Text,
  HStack,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  UnorderedList,
  Button,
  ListItem,
  OrderedList,
  useClipboard
} from "@chakra-ui/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

import "highlight.js/styles/github.css";
import hljs from "highlight.js/lib/core";
import sql from "highlight.js/lib/languages/sql";

import remarkGfm from "remark-gfm";
import BodyText from "../../atoms/Text/BodyText";
import { CopyIcon } from "../../../public/img/icons/copyIcon";
import CheckIcon from "../../../public/img/icons/checkIcon";
import ThumbUpIcon from "../../../public/img/icons/thumbUpIcon";
import ThumbDownIcon from "../../../public/img/icons/thumbDownIcon";

hljs.registerLanguage("sql", sql);

function CodeBlock({ inline, children }) {
  const code = String(children).replace(/\n$/, "");
  const { hasCopied, onCopy } = useClipboard(code);

  if (inline) {
    return (
      <Text
        as="code"
        fontFamily="ui-monospace, monospace"
        backgroundColor="#f7f7f7"
        color="#158237"
        fontSize="90%"
        padding="2px 6px"
        borderRadius="4px"
      >
        {code}
      </Text>
    );
  }

  const highlighted = hljs.highlight(code, { language: "sql" });

  return (
    <Box
      position="relative"
      marginY="24px"
      borderRadius="12px"
      backgroundColor="#F9FAFB"
      overflow="hidden"
      border="1px solid #E5E7EB"
    >
      <Box
        cursor="pointer"
        position="absolute"
        top="12px"
        right="12px"
        display="flex"
        alignItems="center"
        width="16px"
        height="16px"
        fill="#252A32"
        onClick={onCopy}
        backgroundColor="transparent"
      >
        {hasCopied ? (
          <CheckIcon width="16px" height="16px"/>
        ) : (
          <CopyIcon width="16px" height="16px" _hover={{ opacity: 0.7 }}/>
        )}
      </Box>

      <Box
        as="pre"
        display="flex"
        justifyContent="space-between"
        width="100%"
        maxHeight="70vh"
        overflow="auto"
        fontSize="14px"
        backgroundColor="#F9FAFB"
      >
        <Box
          as="code"
          className="hljs hljs-chatbot"
          color="#1F2937"
          dangerouslySetInnerHTML={{ __html: highlighted.value }}
        />
      </Box>
    </Box>
  );
}

const componentsMk = {
  p: ({ children }) => (
    <BodyText as="p" color="#252A32" marginBottom="4px">
      {children}
    </BodyText>
  ),
  strong: ({ children }) => (
    <Text as="strong" fontWeight="bold" color="#252A32">
      {children}
    </Text>
  ),
  em: ({ children }) => (
    <Text as="em" fontStyle="italic" color="#252A32">
      {children}
    </Text>
  ),
  code: ({ children, inline }) => <CodeBlock inline={inline} children={children} />,
  ul: ({ children }) => (
    <UnorderedList margin="8px 0 8px 20px">
      {children}
    </UnorderedList>
  ),
  ol: ({ children }) => (
    <OrderedList >
      {children}
    </OrderedList>
  ),
  li: ({ children }) => (
    <ListItem
      fontFamily="Roboto"
      fontWeight="400"
      fontSize="16px"
      lineHeight="20px"
      color="#252A32"
      margin="0 0 4px 0"
    >
      {children}
    </ListItem>
  ),
}

export default function Message({ message, onFeedback }) {
  const isUser = message.role === "user";
  const [feedback, setFeedback] = useState(null);
  const toast = useToast();

  const handleFeedback = async (rating) => {
    if (onFeedback) {
      const success = await onFeedback(message.id, rating);
      if (success) {
        setFeedback(rating);
        toast({
          duration: 3000,
          position: "bottom",
          render: () => (
            <Box
              width="fit-content"
              display="flex"
              flexDirection="row"
              gap="8px"
              padding="12px 16px"
              backgroundColor="#252A32"
              borderRadius="8px"
              color="#FFF"
              fill="#FFF"
              fontFamily="Roboto"
              fontWeight="500"
              fontSize="14px"
              lineHeight="20px"
            >
              Obrigado pelo seu feedback!
            </Box>
          ),
        });
      }
    }
  };

  return (
    <Flex
      width="100%"
      justify={isUser ? "flex-end" : "flex-start"}
      paddingY="12px"
    >
      <Box
        maxWidth={isUser ? "80%" : "100%"}
        width={isUser ? "fit-content" : "100%"}
        borderRadius="12px"
        padding="16px"
        backgroundColor={isUser ? "#F7F7F7" : "#FFFFFF"}
        color="#000"
      >
        {!isUser && !message.isLoading && message.toolCalls && message.toolCalls.length > 0 && (
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Ver processo de pensamento
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                {message.toolCalls.map((toolCall, index) => (
                  <Box key={index} mb={4} p={2} bg="gray.50" borderRadius="md">
                    <Text fontWeight="bold" textTransform="capitalize">{toolCall.type.replace(/_/g, " ")}</Text>
                    <Box as="pre" p={2} bg="gray.100" borderRadius="md" overflowX="auto">
                      <code>{JSON.stringify(toolCall, null, 2)}</code>
                    </Box>
                  </Box>
                ))}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        )}

        {isUser ? (
          <BodyText
            whiteSpace="pre-wrap"
          >
              {message.content}
          </BodyText>
        ) : (
          <Box className="markdown-body" fontSize="16px">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={componentsMk}
            >
              {message.content}
            </ReactMarkdown>
          </Box>
        )}

        {!isUser && !message.isLoading && !message.isTyping && !message.isError && message.id && (
          <HStack spacing="8px" marginTop="8px" justify="flex-end">
            <Box 
              cursor="pointer" 
              onClick={() => handleFeedback(1)}
              pointerEvents={feedback === 1 ? "none" : "auto"}
              opacity={feedback === 1 ? 1 : 0.5}
              _hover={{ opacity: 1 }}
            >
              <ThumbUpIcon />
            </Box>
            <Box  
              cursor="pointer" 
              onClick={() => handleFeedback(0)}
              pointerEvents={feedback === 0 ? "none" : "auto"}
              opacity={feedback === 0 ? 1 : 0.5}
              _hover={{ opacity: 1 }}
            >
              <ThumbDownIcon />
            </Box>
          </HStack>
        )}
      </Box>
    </Flex>
  );
}
