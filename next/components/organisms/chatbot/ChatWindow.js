import React, { useRef, useCallback } from 'react';
import { VStack, Box } from '@chakra-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import Message from './Message';

function ChatWindow({ messages, onFeedback }) {
  const scrollContainerRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 120,
    overscan: 10,
    gap: 16,
    getItemKey: useCallback((index) => messages[index]?.id || index, [messages])
  });

  return (
    <VStack
      ref={scrollContainerRef}
      width="100%"
      height="100%"
      overflowY="auto"
      paddingX={{ base: "16px", md: "32px" }}
      paddingBottom="24px"
      align="stretch"
      spacing={0}
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

      <Box
        width="100%"
        height={`${rowVirtualizer.getTotalSize()}px`}
        position="relative"
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <Box
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={rowVirtualizer.measureElement}
            position="absolute"
            top={0}
            left={0}
            width="100%"
            transform={`translateY(${virtualRow.start}px)`}
            paddingBottom="16px"
          >
            <Message 
              message={messages[virtualRow.index]} 
              onFeedback={onFeedback} 
            />
          </Box>
        ))}
      </Box>
    </VStack>
  );
}

export default React.memo(ChatWindow);
