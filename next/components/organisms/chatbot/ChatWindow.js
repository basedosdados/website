import React, { useRef, useEffect, useCallback, useState } from 'react';
import { VStack, Box } from '@chakra-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import Message from './Message';

function ChatWindow({ messages, onFeedback }) {
  const scrollContainerRef = useRef(null);
  const prevMessagesLength = useRef(messages.length);
  const prevLastMessageContent = useRef(messages[messages.length - 1]?.content);
  const [shouldFollowBottom, setShouldFollowBottom] = useState(true);

  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 120,
    overscan: 15,
    gap: 16
  });

  const scrollToBottom = useCallback((behavior = "smooth") => {
    if (messages.length > 0) {
      rowVirtualizer.scrollToIndex(messages.length - 1, {
        align: 'end',
        behavior
      });
    }
  }, [messages.length, rowVirtualizer]);

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom("auto");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [messages[0]?.id, scrollToBottom]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const atBottom = (scrollTop + clientHeight) >= scrollHeight * 0.98 || 
        (scrollHeight - scrollTop - clientHeight) < 50;

      setShouldFollowBottom(atBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || messages.length === 0) {
      prevMessagesLength.current = messages.length;
      prevLastMessageContent.current = messages[messages.length - 1]?.content;
      return;
    }

    const lastMessage = messages[messages.length - 1];
    const isNewMessage = messages.length > prevMessagesLength.current;
    const isContentUpdate = lastMessage?.content !== prevLastMessageContent.current;

    const userJustSent = isNewMessage && lastMessage?.role === 'user';

    if (userJustSent) {
      setShouldFollowBottom(true);
    }

    const shouldScroll =
      userJustSent ||
      (shouldFollowBottom && (isNewMessage || isContentUpdate));

    if (shouldScroll) {
      scrollToBottom("auto");
    }

    prevMessagesLength.current = messages.length;
    prevLastMessageContent.current = lastMessage?.content;
  }, [
    messages.length,
    messages[messages.length - 1]?.content,
    scrollToBottom,
    shouldFollowBottom
  ]);

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
