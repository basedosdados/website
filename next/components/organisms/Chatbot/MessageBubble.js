import { useState } from "react";
import { Box, VStack, HStack, Text, Button, Avatar, Spinner } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

import BodyText from "../../atoms/Text/BodyText";
import LabelText from "../../atoms/Text/LabelText";
import CodeDisplay from "./CodeDisplay";
import FeedbackModal from "./FeedbackModal";

export default function MessageBubble({ message, showCode, onFeedback, isStreaming = false }) {
  const { t } = useTranslation('chatbot');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
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
          <Avatar 
            size="sm" 
            name="Você" 
            backgroundColor="#3182CE"
            color="white"
          />
        </HStack>
      </Box>
    );
  }

  return (
    <Box alignSelf="flex-start" maxWidth="80%">
      <HStack spacing={3} align="flex-start">
        <Avatar 
          size="sm" 
          name="Chatbot BD" 
          backgroundColor="#48BB78"
          color="white"
        />
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

              {/* SQL Code Display */}
              {showCode && message.generated_queries && message.generated_queries.length > 0 && (
                <CodeDisplay queries={message.generated_queries} />
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
          <HStack spacing={2} justify="space-between" width="100%">
            <LabelText typography="x-small" color="#616161">
              {formatTime(message.created_at)}
            </LabelText>

            {/* Feedback Buttons */}
            {!isStreaming && !message.error_message && (
              <HStack spacing={1}>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => handleFeedback(1, '')}
                  color={message.feedback?.rating === 1 ? "#48BB78" : "#616161"}
                  _hover={{
                    backgroundColor: "#F0FFF4",
                    color: "#48BB78"
                  }}
                  padding={1}
                  minWidth="auto"
                >
                  {t('feedback.good')}
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => handleFeedback(0, '')}
                  color={message.feedback?.rating === 0 ? "#E53E3E" : "#616161"}
                  _hover={{
                    backgroundColor: "#FED7D7",
                    color: "#E53E3E"
                  }}
                  padding={1}
                  minWidth="auto"
                >
                  {t('feedback.bad')}
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setShowFeedbackModal(true)}
                  color="#616161"
                  _hover={{
                    backgroundColor: "#F7FAFC"
                  }}
                  padding={1}
                  minWidth="auto"
                >
                  {t('feedback.comment_label')}
                </Button>
              </HStack>
            )}
          </HStack>
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