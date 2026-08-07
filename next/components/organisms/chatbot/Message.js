import {
  Box,
  Flex,
  HStack,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm-v3";

import BodyText from "../../atoms/Text/BodyText";
import ThumbUpIcon from "../../../public/img/icons/thumbUpIcon";
import ThumbDownIcon from "../../../public/img/icons/thumbDownIcon";
import { CopyIcon } from "../../../public/img/icons/copyIcon";
import AnimatedCopyIcon from "../../atoms/AnimatedCopyIcon";
import FeedbackModal from "./FeedbackModal";
import { componentsMk } from "./markdown";
import { DownloadResultsButton } from "./DownloadResults";
import {
  DataSourcesList,
  FollowUpQuestionsList,
} from "./StructuredResponse";
import ThinkingSection, { buildToolSteps } from "./ThinkingSection";
import PulseDotLoader from "./PulseDotLoader";

const sectionFadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const SectionFadeInProps = {
  sx: {
    animation: `${sectionFadeIn} 0.4s ease-out both`,
  },
};

const ActionTooltipProps = {
  hasArrow: true,
  backgroundColor: "#252A32",
  borderRadius: "8px",
  letterSpacing: "0.1px",
  lineHeight: "18px",
  fontWeight: "400",
  fontSize: "12px",
  fontFamily: "Roboto",
  color: "#FFFFFF",
  padding: "8px 12px",
  boxShadow: "0 2px 16px rgba(0, 0, 0, 0.16)",
  placement: "top-start",
};

const ActionButtonProps = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "8px",
  padding: "8px",
  minWidth: "34px",
  maxWidth: "34px",
  minHeight: "34px",
  maxHeight: "34px",
  boxSizing: "border-box",
  fill: "#464A51",
};

function Message({ message, onFeedback, onExport, showFollowUpQuestions = false, onFollowUpClick }) {
  const isUser = message.role === "user";
  const [feedback, setFeedback] = useState(message.rating ?? null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [pendingRating, setPendingRating] = useState(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const toast = useToast();

  const toolSteps = useMemo(
    () => buildToolSteps(message.toolCalls),
    [message.toolCalls]
  );

  const downloadableResults = useMemo(() => {
    if (Array.isArray(message.downloads) && message.downloads.length > 0) {
      return message.downloads;
    }

    return toolSteps
      .filter(
        (step) =>
          step.kind === "tool" &&
          step.output?.artifact?.type === "query_result"
      )
      .map((step) => step.output.artifact);
  }, [message.downloads, toolSteps]);

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content || "");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch (error) {
      console.error("Erro ao copiar resposta:", error);
    }
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

  const responseComplete =
    !isUser &&
    !message.isLoading &&
    !message.isTyping &&
    !!message.structuredResponse;

  const dataSources = message.structuredResponse?.data_sources;
  const hasDataSources =
    Array.isArray(dataSources) && dataSources.length > 0;

  const showDataSources = responseComplete && hasDataSources;

  const showFollowUps =
    responseComplete &&
    showFollowUpQuestions;

  return (
    <Flex width="100%" direction="column" align="stretch" minWidth={0}>
      <Box
        width="100%"
        maxWidth="760px"
        margin="0 auto"
        display="flex"
        justifyContent={isUser ? "flex-end" : "flex-start"}
        minWidth={0}
        paddingX={{ base: "0", md: 0 }}
      >
        <Box
          maxWidth={isUser ? { base: "90%", md: "80%" } : "100%"}
          width={isUser ? "fit-content" : "100%"}
          minWidth={isUser ? undefined : 0}
          borderRadius="12px"
          padding={{ base: "12px", md: "16px" }}
          margin={isUser ? { base: "16px 0 8px", md: "32px 0 16px" } : 0}
          backgroundColor={isUser ? "#F7F7F7" : "#FFFFFF"}
          color="#000"
          overflow="hidden"
        >
          {(showThinkingSection || showDiceLoader) && (
            <Box marginBottom="16px">
              {showThinkingSection && (
                <ThinkingSection
                  toolSteps={toolSteps}
                  isLoading={message.isLoading}
                  messageId={message.id}
                  onExport={onExport}
                />
              )}
              {showDiceLoader && <PulseDotLoader margin="8px 0 0 4px" />}
            </Box>
          )}

          {isUser ? (
            <BodyText
              whiteSpace="pre-wrap"
              wordBreak="break-word"
              overflowWrap="anywhere"
            >
              {message.content}
            </BodyText>
          ) : (
            <Box
              className="markdown-body"
              fontSize={{ base: "15px", md: "16px" }}
              overflowX="auto"
              maxWidth="100%"
              sx={{
                wordBreak: "break-word",
                overflowWrap: "anywhere",
              }}
            >
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
            !message.isError &&
            message.id && (
              <HStack
                spacing="8px"
                marginTop="16px"
                width="100%"
                justifyContent="space-between"
              >
                <Flex gap="8px" alignItems="center">
                  <Tooltip
                    {...ActionTooltipProps}
                    label={isCopied ? "Copiado!" : "Copiar resposta"}
                  >
                    <Box
                      {...ActionButtonProps}
                      cursor="pointer"
                      onClick={handleCopy}
                      _hover={{
                        backgroundColor: "#EEEEEE",
                      }}
                    >
                      <AnimatedCopyIcon
                        copied={isCopied}
                        icon={CopyIcon}
                        width="18px"
                        height="18px"
                      />
                    </Box>
                  </Tooltip>

                  <DownloadResultsButton
                    messageId={message.id}
                    downloads={downloadableResults}
                    onExport={onExport}
                  />
                </Flex>

                <Flex gap="8px">
                  <Tooltip {...ActionTooltipProps} label="Boa resposta">
                    <Box
                      {...ActionButtonProps}
                      cursor={feedback != null ? "default" : "pointer"}
                      onClick={() => openFeedbackModal(1)}
                      pointerEvents={feedback != null ? "none" : "auto"}
                      _hover={{
                        backgroundColor:
                          feedback != null ? undefined : "#EEEEEE",
                      }}
                    >
                      <ThumbUpIcon width="18px" height="18px" />
                    </Box>
                  </Tooltip>
                  <Tooltip {...ActionTooltipProps} label="Resposta ruim">
                    <Box
                      {...ActionButtonProps}
                      cursor={feedback != null ? "default" : "pointer"}
                      onClick={() => openFeedbackModal(0)}
                      pointerEvents={feedback != null ? "none" : "auto"}
                      _hover={{
                        backgroundColor:
                          feedback != null ? undefined : "#EEEEEE",
                      }}
                    >
                      <ThumbDownIcon width="18px" height="18px" />
                    </Box>
                  </Tooltip>
                </Flex>
              </HStack>
            )}
        </Box>
      </Box>

      {showDataSources ? (
        <Box
          width="100%"
          maxWidth="760px"
          margin="0 auto"
          {...SectionFadeInProps}
        >
          <DataSourcesList dataSources={dataSources} />
        </Box>
      ) : null}

      {showFollowUps ? (
        <Box
          width="100%"
          maxWidth="760px"
          margin="0 auto"
          sx={{
            animation: `${sectionFadeIn} 0.4s ease-out ${
              showDataSources ? "0.28s" : "0s"
            } both`,
          }}
        >
          <FollowUpQuestionsList
            followUpQuestions={message.structuredResponse.follow_up_prompts}
            onQuestionClick={onFollowUpClick}
          />
        </Box>
      ) : null}

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={closeFeedbackModal}
        rating={pendingRating}
        onSubmit={handleFeedbackSubmit}
        isSubmitting={isSubmittingFeedback}
      />
    </Flex>
  );
}

export default React.memo(Message);
