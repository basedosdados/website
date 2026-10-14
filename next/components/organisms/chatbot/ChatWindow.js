import React, { useRef, useCallback, useEffect, useMemo, useState } from 'react';
import { VStack, Box } from '@chakra-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import Message from './Message';

function ChatWindow({
  threadId,
  messagesThreadId,
  messages,
  onFeedback,
  onExport,
  onFollowUpClick,
  scrollTrigger,
}) {
  const messagesReady = Boolean(threadId) && String(messagesThreadId) === String(threadId);
  const [opacity, setOpacity] = useState(() => (messagesReady ? 1 : 0));
  const [shownMessages, setShownMessages] = useState(messages);

  useEffect(() => {
    if (!messagesReady) {
      setOpacity(0);
      return;
    }
    setShownMessages(messages);
    setOpacity(1);
  }, [messagesReady, messages]);

  const scrollContainerRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);
  const isProgrammaticScrollRef = useRef(false);
  const touchStartYRef = useRef(null);
  const bottomThreshold = 80;

  const lastAssistantMessageId = useMemo(() => {
    for (let i = shownMessages.length - 1; i >= 0; i -= 1) {
      const msg = shownMessages[i];
      if (msg?.role === 'assistant') {
        return msg.id;
      }
    }
    return null;
  }, [shownMessages]);

  const rowVirtualizer = useVirtualizer({
    count: shownMessages.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 160,
    overscan: 10,
    gap: 12,
    getItemKey: useCallback(
      (index) => shownMessages[index]?.id || index,
      [shownMessages]
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
    const el = scrollContainerRef.current;
    if (!el) return;

    if (isProgrammaticScrollRef.current) return;

    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;

    shouldAutoScrollRef.current = distanceFromBottom < bottomThreshold;
  }, []);

  const handleWheel = useCallback((e) => {
    if (e.deltaY < 0) {
      shouldAutoScrollRef.current = false;
    }
  }, []);

  const handleTouchStart = useCallback((e) => {
    touchStartYRef.current = e.touches?.[0]?.clientY ?? null;
  }, []);

  const handleTouchMove = useCallback((e) => {
    const startY = touchStartYRef.current;
    const currentY = e.touches?.[0]?.clientY;
    if (startY == null || currentY == null) return;

    if (currentY - startY > 0) {
      shouldAutoScrollRef.current = false;
    }
    touchStartYRef.current = currentY;
  }, []);

  useEffect(() => {
    if (!shownMessages.length) return;

    shouldAutoScrollRef.current = true;
    scrollToBottom();
  }, [scrollTrigger, scrollToBottom, shownMessages.length]);

  useEffect(() => {
    if (!shouldAutoScrollRef.current) return;

    scrollToBottom();
  }, [shownMessages, scrollToBottom]);

  const totalSize = rowVirtualizer.getTotalSize();
  useEffect(() => {
    if (!shouldAutoScrollRef.current) return;

    scrollToBottom();
  }, [totalSize, scrollToBottom]);

  return (
    <VStack
      ref={scrollContainerRef}
      onScroll={handleScroll}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      flex="1"
      width="100%"
      minHeight={0}
      minWidth={0}
      opacity={opacity}
      overflowY="auto"
      overflowX="hidden"
      paddingBottom={{ base: "12px", md: "24px" }}
      transition="opacity 0.18s ease"
      sx={{
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
        },
      }}
      align="stretch"
      spacing={0}
      css={{
        overflowAnchor: "none",
        scrollbarGutter: "stable",
        WebkitOverflowScrolling: "touch",
        "&::-webkit-scrollbar": {
          width: "6px",
          background: "transparent",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#C4C4C4",
          borderRadius: "24px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#ACAEB1",
        },
        "@media (max-width: 767px)": {
          scrollbarGutter: "auto",
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
              message={shownMessages[virtualRow.index]}
              onFeedback={onFeedback}
              onExport={onExport}
              showFollowUpQuestions={
                shownMessages[virtualRow.index]?.id === lastAssistantMessageId &&
                !shownMessages[virtualRow.index]?.isLoading &&
                !shownMessages[virtualRow.index]?.isTyping
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
