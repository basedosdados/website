import React, { useRef, useCallback, useEffect } from 'react';
import { VStack, Box } from '@chakra-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import Message from './Message';

function ChatWindow({ messages, onFeedback, scrollTrigger }) {
  const scrollContainerRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);
  const bottomThreshold = 80;

  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 160,
    overscan: 10,
    gap: 16,
    getItemKey: useCallback(
      (index) => messages[index]?.id || index,
      [messages]
    ),
  });

  const scrollToBottom = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;

    shouldAutoScrollRef.current = distanceFromBottom < bottomThreshold;
  }, []);

  useEffect(() => {
    if (!messages.length) return;

    shouldAutoScrollRef.current = true;
    scrollToBottom();
  }, [scrollTrigger, scrollToBottom]);

  useEffect(() => {
    if (!shouldAutoScrollRef.current) return;

    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <VStack
      ref={scrollContainerRef}
      onScroll={handleScroll}
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
