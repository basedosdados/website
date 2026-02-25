import { useRef, useEffect } from 'react';
import { VStack, Box } from '@chakra-ui/react';
import Message from './Message';

export default function ChatWindow({ messages, onFeedback }) {
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const prevMessagesLength = useRef(messages.length);

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const isNewMessage = messages.length > prevMessagesLength.current;
      
      const newMessages = messages.slice(prevMessagesLength.current);
      const hasUserMessage = newMessages.some(msg => msg.role === 'user');
      
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 150;
      
      if (hasUserMessage) {
        scrollToBottom("smooth");
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      } else if (isAtBottom && isNewMessage) {
        scrollToBottom("auto");
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

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
