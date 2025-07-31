import { useState } from "react";
import { Box, VStack, HStack, Text, Button, Avatar, Spinner, Collapse, Code, Badge, IconButton, Textarea } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

import BodyText from "../../atoms/Text/BodyText";
import LabelText from "../../atoms/Text/LabelText";
import CodeDisplay from "./CodeDisplay";
import FeedbackModal from "./FeedbackModal";

export default function MessageBubble({ message, onFeedback, isStreaming = false }) {
  const { t } = useTranslation('chatbot');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(null);
  const isUser = message.isUser || message.user_message && !message.assistant_message;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleFeedback = (rating, comment) => {
    onFeedback(message.id, rating, comment);
    setShowFeedbackModal(false);
    setShowComments(false);
    setCommentText('');
    setFeedbackRating(rating);
  };

  const handleFeedbackClick = (rating) => {
    setFeedbackRating(rating);
    setShowComments(true);
  };

  const handleSendFeedback = () => {
    handleFeedback(feedbackRating, commentText);
  };

  if (isUser) {
    return (
      <Box alignSelf="flex-end" maxWidth="80%">
        <HStack spacing={3} align="flex-end">
          <VStack spacing={2} align="flex-end">
            <Box
              backgroundColor="#3182CE"
              color="white"
              padding={3}
              borderRadius="16px 16px 4px 16px"
              maxWidth="100%"
            >
              <BodyText typography="small" color="white">
                {message.user_message}
              </BodyText>
            </Box>
            <LabelText typography="x-small" color="#616161">
              {formatTime(message.created_at)}
            </LabelText>
          </VStack>
          <Box
            size="sm"
            backgroundColor="#3182CE"
            color="white"
            borderRadius="50%"
            width="32px"
            height="32px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="xs"
            fontWeight="bold"
          >
            {t('me')}
          </Box>
        </HStack>
      </Box>
    );
  }

  return (
    <Box alignSelf="flex-start" maxWidth="80%">
      <HStack spacing={3} align="flex-start">
        <Box
          size="sm"
          backgroundColor="#48BB78"
          color="white"
          borderRadius="50%"
          width="32px"
          height="32px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="xs"
          fontWeight="bold"
        >
          {t('bot_name').charAt(0)}
        </Box>
        <VStack spacing={2} align="flex-start" flex={1}>
          <Box
            backgroundColor="white"
            border="1px solid #E2E8F0"
            padding={3}
            borderRadius="16px 16px 16px 4px"
            maxWidth="100%"
          >
            <VStack spacing={3} align="stretch">
              {/* Assistant Message */}
              <BodyText typography="small" color="#252A32">
                {isStreaming ? (
                  <HStack spacing={2}>
                    <Text>{message.assistant_message || t('thinking')}</Text>
                    {isStreaming && <Spinner size="xs" />}
                  </HStack>
                ) : (
                  message.assistant_message || message.error_message
                )}
              </BodyText>

              {/* Error Message */}
              {message.error_message && (
                <Box
                  backgroundColor="#FED7D7"
                  border="1px solid #FEB2B2"
                  borderRadius="8px"
                  padding={2}
                >
                  <BodyText typography="x-small" color="#E53E3E">
                    {message.error_message}
                  </BodyText>
                </Box>
              )}

              {/* SQL Code Display - Always show if available */}
              {message.generated_queries && message.generated_queries.length > 0 && (
                <Box>
                  <VStack spacing={2} align="stretch">
                    {message.generated_queries.map((query, index) => (
                      <Box
                        key={index}
                        backgroundColor="#F7FAFC"
                        border="1px solid #E2E8F0"
                        borderRadius="8px"
                        padding={3}
                      >
                        <LabelText typography="x-small" color="#616161" marginBottom={2}>
                          {t('sql_query')} {message.generated_queries.length > 1 ? `#${index + 1}` : ''}
                        </LabelText>
                        <Code
                          display="block"
                          whiteSpace="pre-wrap"
                          fontSize="xs"
                          backgroundColor="#2D3748"
                          color="white"
                          padding={3}
                          borderRadius="6px"
                          overflowX="auto"
                        >
                          {query}
                        </Code>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}

              {/* Steps Display */}
              {message.steps && message.steps.length > 0 && (
                <Box>
                  <LabelText typography="x-small" color="#616161" marginBottom={2}>
                    {t('process')}
                  </LabelText>
                  <VStack spacing={1} align="stretch">
                    {message.steps.map((step, index) => (
                      <Box
                        key={index}
                        backgroundColor="#F7FAFC"
                        border="1px solid #E2E8F0"
                        borderRadius="6px"
                        padding={2}
                      >
                        <LabelText typography="x-small" color="#616161" fontWeight="500">
                          {step.label}
                        </LabelText>
                        <BodyText typography="x-small" color="#616161" marginTop={1}>
                          {step.content}
                        </BodyText>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}
            </VStack>
          </Box>

          {/* Message Footer */}
          <VStack spacing={2} align="stretch" width="100%">
            <HStack spacing={2} justify="space-between">
              <LabelText typography="x-small" color="#616161">
                {formatTime(message.created_at)}
              </LabelText>

              {/* Feedback Buttons */}
              {!isStreaming && !message.error_message && (
                <HStack spacing={1}>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleFeedbackClick(1)}
                    color={feedbackRating === 1 || message.feedback?.rating === 1 ? "#48BB78" : "#616161"}
                    _hover={{
                      backgroundColor: "#F0FFF4",
                      color: "#48BB78"
                    }}
                    padding={1}
                    minWidth="auto"
                  >
                    👍
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleFeedbackClick(0)}
                    color={feedbackRating === 0 || message.feedback?.rating === 0 ? "#E53E3E" : "#616161"}
                    _hover={{
                      backgroundColor: "#FED7D7",
                      color: "#E53E3E"
                    }}
                    padding={1}
                    minWidth="auto"
                  >
                    👎
                  </Button>
                </HStack>
              )}
            </HStack>

            {/* Comments Section */}
            <Collapse in={showComments}>
              <VStack spacing={2} align="stretch">
                <Textarea
                  size="sm"
                  placeholder={t('feedback.comment_placeholder')}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  resize="vertical"
                  minHeight="60px"
                />
                <HStack spacing={2} justify="flex-end">
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => {
                      setShowComments(false);
                      setCommentText('');
                      setFeedbackRating(null);
                    }}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    size="xs"
                    colorScheme="blue"
                    onClick={handleSendFeedback}
                    isDisabled={!feedbackRating}
                  >
                    {t('send')}
                  </Button>
                </HStack>
              </VStack>
            </Collapse>
          </VStack>
        </VStack>
      </HStack>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={handleFeedback}
          initialRating={message.feedback?.rating}
          initialComment={message.feedback?.comment}
        />
      )}
    </Box>
  );
} 