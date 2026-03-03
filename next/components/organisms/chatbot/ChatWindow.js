import React, { useRef, useEffect, useCallback } from 'react';
import { VStack, Box } from '@chakra-ui/react';
import Message from './Message';

function ChatWindow({ messages, onFeedback }) {
  const scrollContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const prevMessagesLength = useRef(messages.length);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior
      });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom("auto");
    }
  }, [messages[0]?.id]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const isNewMessage = messages.length > prevMessagesLength.current;
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 150;

    if (isNewMessage && isAtBottom) {
      scrollToBottom("auto");
    }

    prevMessagesLength.current = messages.length;
  }, [messages, scrollToBottom]);

  return (
    <VStack
      ref={scrollContainerRef}
      width="100%"
      height="100%"
      overflowY="auto"
      paddingX={{ base: "16px", md: "48px", lg: "120px" }}
      paddingBottom="24px"
      spacing="16px"
      align="stretch"
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
    >
      <Box flex="1"/>

      {messages.map((msg, index) => (
        <Message 
          key={msg.id || `msg-${index}`} 
          message={msg} 
          onFeedback={onFeedback} 
        />
      ))}

      <div ref={messagesEndRef} />
    </VStack>
  );
}

export default React.memo(ChatWindow);
