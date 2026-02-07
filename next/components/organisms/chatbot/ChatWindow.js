import { useRef, useEffect } from 'react';
import { VStack, Box } from '@chakra-ui/react';
import Message from './Message';

export default function ChatWindow({ messages, onFeedback }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <VStack
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
      <Box flex="1" />

      {messages.map((msg) => (
        <Message 
          key={msg.id} 
          message={msg} 
          onFeedback={onFeedback} 
        />
      ))}

      <div ref={messagesEndRef} />
    </VStack>
  );
}
