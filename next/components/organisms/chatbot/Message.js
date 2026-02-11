import {
  Box,
  Flex,
  Text,
  HStack,
  useToast
} from "@chakra-ui/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyIcon } from "@chakra-ui/icons";
import ThumbUpIcon from "../../../public/img/icons/thumbUpIcon";
import ThumbDownIcon from "../../../public/img/icons/thumbDownIcon";

const CodeBlock = ({ inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return !inline && match ? (
    <Box position="relative" marginY="16px" borderRadius="8px" bg="#F5F5F5">
      <Flex
        justify="space-between"
        align="center"
        bg="#E0E0E0"
        borderTopRadius="8px"
        padding="4px 12px"
      >
        <Text fontSize="12px" color="#333">{match[1]}</Text>
        <Box cursor="pointer" onClick={handleCopy}>
          {copied ? <Text fontSize="12px" color="green.500">Copied!</Text> : <CopyIcon w={3} h={3} />}
        </Box>
      </Flex>
      <Box padding="12px" overflowX="auto">
        <code className={className} {...props}>
          {children}
        </code>
      </Box>
    </Box>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

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
        {isUser ? (
          <Text whiteSpace="pre-wrap" fontSize="16px">{message.content}</Text>
        ) : (
          <Box className="markdown-body" fontSize="16px">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock,
                a: ({ node, ...props }) => <a style={{ color: "blue", textDecoration: "underline" }} {...props} />,
                th: ({ node, ...props }) => <th style={{ border: "1px solid #ddd", padding: "8px", background: "#f2f2f2" }} {...props} />,
                td: ({ node, ...props }) => <td style={{ border: "1px solid #ddd", padding: "8px" }} {...props} />,
              }}
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
