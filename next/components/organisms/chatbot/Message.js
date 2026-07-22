import { Box, Flex, HStack, VStack, useToast } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm-v3";

import BodyText from "../../atoms/Text/BodyText";
import ThumbUpIcon from "../../../public/img/icons/thumbUpIcon";
import ThumbDownIcon from "../../../public/img/icons/thumbDownIcon";
import FeedbackModal from "./FeedbackModal";
import { componentsMk } from "./markdown";
import {
  DataSourcesList,
  TemporalCoverageInfo,
  FollowUpQuestionsList,
} from "./StructuredResponse";
import ThinkingSection, { buildToolSteps } from "./ThinkingSection";
import RollingDiceLoader from "./RollingDiceLoader";

function Message({ message, onFeedback, showFollowUpQuestions = false, onFollowUpClick }) {
  const isUser = message.role === "user";
  const [feedback, setFeedback] = useState(message.rating ?? null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [pendingRating, setPendingRating] = useState(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const toast = useToast();

  const toolSteps = useMemo(
    () => buildToolSteps(message.toolCalls),
    [message.toolCalls]
  );

  const showThinkingSection =
    !isUser && !message.isError && toolSteps.length > 0;

  const showDiceLoader =
    !isUser &&
    message.isLoading &&
    !message.isError &&
    !message.isTyping &&
    !(message.content || "").trim();

  React.useEffect(() => {
    if (message.rating != null) {
      setFeedback(message.rating);
    }
  }, [message.rating]);

  const showFeedbackToast = () => {
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
  };

  const openFeedbackModal = (rating) => {
    if (feedback != null) return;
    setPendingRating(rating);
    setIsFeedbackModalOpen(true);
  };

  const closeFeedbackModal = () => {
    if (isSubmittingFeedback) return;
    setIsFeedbackModalOpen(false);
    setPendingRating(null);
  };

  const handleFeedbackSubmit = async (content) => {
    if (!onFeedback || pendingRating == null) return;

    setIsSubmittingFeedback(true);
    try {
      const success = await onFeedback(message.id, pendingRating, content);
      if (success) {
        setFeedback(pendingRating);
        setIsFeedbackModalOpen(false);
        setPendingRating(null);
        showFeedbackToast();
      }
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <Flex
      width="100%"
      maxWidth="760px"
      margin="0 auto"
      justify={isUser ? "flex-end" : "flex-start"}
    >
      <Box
        maxWidth={isUser ? "80%" : "100%"}
        width={isUser ? "fit-content" : "100%"}
        minW={isUser ? undefined : 0}
        borderRadius="12px"
        padding="16px"
        backgroundColor={isUser ? "#F7F7F7" : "#FFFFFF"}
        color="#000"
      >
        {(showThinkingSection || showDiceLoader) && (
          <Box marginBottom="16px">
            {showThinkingSection && (
              <ThinkingSection
                toolSteps={toolSteps}
                isLoading={message.isLoading}
              />
            )}

            {showDiceLoader && <RollingDiceLoader marginBottom="0" />}
          </Box>
        )}

        {!isUser && !message.isLoading && message.structuredResponse && (
          <VStack
            spacing="16px"
            width="100%"
            maxW="100%"
            minW={0}
            alignItems="stretch"
            margin="16px 0"
          >
            <DataSourcesList
              dataSources={message.structuredResponse.data_sources}
            />
            <TemporalCoverageInfo
              temporalCoverage={message.structuredResponse.temporal_coverage}
            />
          </VStack>
        )}

        {isUser ? (
          <BodyText whiteSpace="pre-wrap">{message.content}</BodyText>
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

        {!isUser &&
        !message.isLoading &&
        !message.isTyping &&
        message.structuredResponse &&
        showFollowUpQuestions ? (
          <FollowUpQuestionsList
            followUpQuestions={message.structuredResponse.follow_up_questions}
            onQuestionClick={onFollowUpClick}
          />
        ) : null}

        {!isUser &&
          !message.isLoading &&
          !message.isTyping &&
          !message.isError &&
          message.id && (
            <HStack spacing="8px" marginTop="8px" justify="flex-end">
              <Box
                cursor={feedback != null ? "default" : "pointer"}
                onClick={() => openFeedbackModal(1)}
                pointerEvents={feedback != null ? "none" : "auto"}
                opacity={feedback === 1 ? 1 : 0.5}
                _hover={{ opacity: feedback != null ? undefined : 1 }}
              >
                <ThumbUpIcon width="18px" height="18px" />
              </Box>
              <Box
                cursor={feedback != null ? "default" : "pointer"}
                onClick={() => openFeedbackModal(0)}
                pointerEvents={feedback != null ? "none" : "auto"}
                opacity={feedback === 0 ? 1 : 0.5}
                _hover={{ opacity: feedback != null ? undefined : 1 }}
              >
                <ThumbDownIcon width="18px" height="18px" />
              </Box>
            </HStack>
          )}

        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={closeFeedbackModal}
          rating={pendingRating}
          onSubmit={handleFeedbackSubmit}
          isSubmitting={isSubmittingFeedback}
        />
      </Box>
    </Flex>
  );
}

export default React.memo(Message);
