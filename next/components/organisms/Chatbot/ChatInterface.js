import { useState, useEffect, useRef } from "react";
import { Box, VStack, HStack, Input, Button, Text, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

import MessageBubble from "./MessageBubble";
import CodeDisplay from "./CodeDisplay";
import FeedbackModal from "./FeedbackModal";
import BodyText from "../../atoms/Text/BodyText";

export default function ChatInterface({ threadId, onNewThread }) {
  const { t } = useTranslation('chatbot');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (threadId) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [threadId]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/chatbot/messages?thread_id=${threadId}&order_by=created_at`);
      
      if (!response.ok) {
        throw new Error('Failed to load messages');
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Erro ao carregar mensagens');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewThread = async (title) => {
    try {
      const response = await fetch('/api/chatbot/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error('Failed to create thread');
      }

      const newThread = await response.json();
      onNewThread(newThread.id);
      return newThread.id;
    } catch (error) {
      console.error('Error creating thread:', error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isStreaming) return;

    const messageContent = inputMessage.trim();
    setInputMessage("");
    setError(null);

    // Add user message immediately
    const userMessage = {
      id: Date.now().toString(),
      user_message: messageContent,
      assistant_message: null,
      created_at: new Date().toISOString(),
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);

    let currentThreadId = threadId;
    
    try {
      setIsStreaming(true);

      // Create new thread if none exists
      if (!currentThreadId) {
        currentThreadId = await createNewThread(messageContent.substring(0, 50) + "...");
      }

      // Send message with streaming
      const response = await fetch(`/api/chatbot/messages?thread_id=${currentThreadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Date.now().toString(),
          content: messageContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = {
        id: Date.now().toString(),
        user_message: messageContent,
        assistant_message: "",
        created_at: new Date().toISOString(),
        isUser: false,
        generated_queries: [],
        steps: [],
      };

      setCurrentStreamingMessage(assistantMessage);

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.status === 'running') {
                assistantMessage.steps.push(data.data);
              } else if (data.status === 'complete') {
                assistantMessage = { ...assistantMessage, ...data.data };
                break;
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }

      // Add final message
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentStreamingMessage(null);

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Erro ao enviar mensagem. Tente novamente.');
      
      // Remove the user message on error
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFeedback = async (messageId, rating, comment) => {
    try {
      const response = await fetch(`/api/chatbot/feedback?message_pair_id=${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      // Update message with feedback
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, feedback: { rating, comment } }
          : msg
      ));

    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Erro ao enviar feedback');
    }
  };

  if (isLoading) {
    return (
      <Box height="100%" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>{t('loading_conversation')}</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box height="100%" display="flex" flexDirection="column">
      {/* Error Alert */}
      {error && (
        <Alert status="error" borderRadius="8px" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* Messages Area */}
      <Box 
        flex={1} 
        overflowY="auto" 
        padding={4}
        backgroundColor="#F8F9FA"
        borderRadius="8px"
        marginBottom={4}
      >
        <VStack spacing={4} align="stretch">
          {messages.length === 0 && !isStreaming && (
            <Box textAlign="center" padding={8}>
              <BodyText typography="medium" color="#616161">
                {t('start_new_conversation')}
              </BodyText>
            </Box>
          )}

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              showCode={showCode}
              onFeedback={handleFeedback}
            />
          ))}

          {currentStreamingMessage && (
            <MessageBubble
              message={currentStreamingMessage}
              showCode={showCode}
              isStreaming={true}
            />
          )}

          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Input Area */}
      <Box>
        <HStack spacing={3}>
          <Input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('input_placeholder')}
            disabled={isStreaming}
            backgroundColor="white"
            borderColor="#E2E8F0"
            _focus={{
              borderColor: "#3182CE",
              boxShadow: "0 0 0 1px #3182CE"
            }}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isStreaming}
            backgroundColor="#3182CE"
            color="white"
            _hover={{
              backgroundColor: "#2C5AA0"
            }}
            _disabled={{
              backgroundColor: "#CBD5E0",
              cursor: "not-allowed"
            }}
          >
            {isStreaming ? <Spinner size="sm" /> : "Enviar"}
          </Button>
        </HStack>

        {/* Code Display Toggle */}
        <HStack spacing={4} marginTop={3}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCode(!showCode)}
            borderColor="#E2E8F0"
            color="#616161"
            _hover={{
              borderColor: "#CBD5E0",
              backgroundColor: "#F7FAFC"
            }}
          >
            {showCode ? t('hide_code') : t('show_code')}
          </Button>
        </HStack>
      </Box>
    </Box>
  );
} 