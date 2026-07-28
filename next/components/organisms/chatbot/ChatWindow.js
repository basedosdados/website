import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import { VStack, Box } from '@chakra-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import Message from './Message';

function ChatWindow({ messages, onFeedback, onFollowUpClick, scrollTrigger }) {
  const scrollContainerRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);
  const isProgrammaticScrollRef = useRef(false);
  const bottomThreshold = 80;

  const lastAssistantMessageId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const msg = messages[i];
      if (msg?.role === 'assistant') {
        return msg.id;
      }
    }
    return null;
  }, [messages]);

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
      if (!scrollContainerRef.current) return;
      isProgrammaticScrollRef.current = true;
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      requestAnimationFrame(() => {
        isProgrammaticScrollRef.current = false;
      });
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;

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

  const totalSize = rowVirtualizer.getTotalSize();
  useEffect(() => {
    if (!shouldAutoScrollRef.current) return;

    scrollToBottom();
  }, [totalSize, scrollToBottom]);

  return (
    <VStack
      ref={scrollContainerRef}
      onScroll={handleScroll}
      width="100%"
      height="100%"
      overflowY="auto"
      paddingBottom="24px"
      align="stretch"
      spacing={0}
      css={{
        overflowAnchor: "none",
        scrollbarGutter: "stable",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          width: "8px",
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
          >
            <Message
              message={messages[virtualRow.index]}
              onFeedback={onFeedback}
              showFollowUpQuestions={
                messages[virtualRow.index]?.id === lastAssistantMessageId &&
                !messages[virtualRow.index]?.isLoading &&
                !messages[virtualRow.index]?.isTyping
              }
              onFollowUpClick={onFollowUpClick}
            />
          </Box>
        ))}
      </Box>
    </VStack>
  );
}

export default React.memo(ChatWindow);
