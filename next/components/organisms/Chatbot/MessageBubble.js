import { useState } from "react";
import { Box, VStack, HStack, Text, Button, Avatar, Spinner, Collapse, Code, Badge, IconButton, Textarea, Flex } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useTranslation } from "next-i18next";

import BodyText from "../../atoms/Text/BodyText";
import LabelText from "../../atoms/Text/LabelText";
import CodeDisplay from "./CodeDisplay";
import FeedbackModal from "./FeedbackModal";
import MarkdownText from "./MarkdownText";

export default function MessageBubble({ message, onFeedback, isStreaming = false }) {
  const { t } = useTranslation('chatbot');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(null);
  
  // Check if this is a user-only message (temporary frontend message) or a message pair (from backend)
  const isUserOnlyMessage = message.isUser === true;

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

  // Render user-only message (temporary frontend message)
  if (isUserOnlyMessage) {
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
              <MarkdownText typography="small" color="white">
                {message.user_message}
              </MarkdownText>
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

  // Render message pair (user message + assistant response)
  return (
    <VStack spacing={4} align="stretch" width="100%">
      {/* User Message Part of the Pair */}
      {message.user_message && (
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
                            <MarkdownText typography="small" color="white">
              {message.user_message}
            </MarkdownText>
              </Box>
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
      )}

      {/* Assistant Response Part of the Pair */}
      {(isStreaming || message.assistant_message || message.error_message) && (
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
              {t('bot_avatar')}
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
                  {message.assistant_message && (
                    <MarkdownText typography="small" color="#252A32">
                      {message.assistant_message}
                    </MarkdownText>
                  )}
                  
                  {/* Streaming Status */}
                  {isStreaming && !message.assistant_message && (
                    <HStack spacing={2}>
                      <Spinner size="xs" />
                      <BodyText typography="small" color="#616161">
                        {message.steps && message.steps.length > 0 
                          ? message.steps[message.steps.length - 1]?.label || t('thinking')
                          : t('thinking')
                        }
                      </BodyText>
                    </HStack>
                  )}

                  {/* Error Message */}
                  {message.error_message && (
                    <Box
                      backgroundColor="#FED7D7"
                      border="1px solid #FEB2B2"
                      borderRadius="8px"
                      padding={2}
                    >
                                          <MarkdownText typography="small" color="#E53E3E">
                      {message.error_message}
                    </MarkdownText>
                    </Box>
                  )}

                  {/* Collapsible Steps Display */}
                  {message.steps && message.steps.length > 0 && !isStreaming && (
                    <Box>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSteps(!showSteps)}
                        leftIcon={showSteps ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        color="#616161"
                        fontSize="sm"
                        fontWeight="normal"
                        padding={2}
                        height="auto"
                      >
                        {showSteps ? t('hide_processing_steps') : t('show_processing_steps')} ({message.steps.length})
                      </Button>
                      <Collapse in={showSteps}>
                        <VStack spacing={1} align="stretch" marginTop={2}>
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
                              <Box marginTop={1}>
                                                              <MarkdownText 
                                typography="small" 
                                color="#616161"
                              >
                                {step.content
                                  ?.replace(/^##### /gm, '')
                                  ?.replace(/---\n?/g, '')
                                  ?.trim()
                                }
                              </MarkdownText>
                              </Box>
                            </Box>
                          ))}
                        </VStack>
                      </Collapse>
                    </Box>
                  )}

                  {/* Collapsible SQL Code Display */}
                  {message.generated_queries && message.generated_queries.length > 0 && !isStreaming && (
                    <Box>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCode(!showCode)}
                        leftIcon={showCode ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        color="#616161"
                        fontSize="sm"
                        fontWeight="normal"
                        padding={2}
                        height="auto"
                      >
                        {showCode ? t('hide_sql_code') : t('show_sql_code')} ({message.generated_queries.length} {message.generated_queries.length === 1 ? t('query') : t('queries')})
                      </Button>
                      <Collapse in={showCode}>
                        <VStack spacing={2} align="stretch" marginTop={2}>
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
                      </Collapse>
                    </Box>
                  )}
                </VStack>
              </Box>

              {/* Message Footer with Action Buttons */}
              <VStack spacing={2} align="stretch" width="100%">
                <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
                  <LabelText typography="x-small" color="#616161">
                    {formatTime(message.created_at)}
                  </LabelText>

                  {/* Action Buttons */}
                  {!isStreaming && (message.assistant_message || message.error_message) && (
                    <HStack spacing={1} flexWrap="wrap">
                      {/* Feedback Buttons */}
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
                        title={t('good_response')}
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
                        title={t('poor_response')}
                      >
                        👎
                      </Button>
                      
                      {/* Show SQL Code Button */}
                      {message.generated_queries && message.generated_queries.length > 0 && (
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => setShowCode(!showCode)}
                          color="#616161"
                          _hover={{
                            backgroundColor: "#F7FAFC",
                            color: "#3182CE"
                          }}
                          padding={1}
                          minWidth="auto"
                          fontSize="10px"
                          title={t('toggle_sql_visibility')}
                        >
                          {t('sql_button')}
                        </Button>
                      )}
                    </HStack>
                  )}
                </Flex>

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
        </Box>
      )}

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
    </VStack>
  );
} 