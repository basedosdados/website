import { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import { Box, VStack, HStack, Input, Button, Text, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import MessageBubble from "./MessageBubble";
import BodyText from "../../atoms/Text/BodyText";

export default function ChatInterface({ threadId, onNewThread, onThreadActivity }) {
  const { t } = useTranslation('chatbot');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState(null);
  const [loadedThreadId, setLoadedThreadId] = useState(null); // Track which thread's messages are loaded
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Load messages when threadId changes (but not during streaming)
  useEffect(() => {
    if (threadId && threadId !== loadedThreadId) {
      loadMessages();
    } else if (!threadId) {
      setMessages([]);
      setLoadedThreadId(null);
    }
  }, [threadId]); // Only reload when threadId actually changes

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    // Use requestAnimationFrame to ensure DOM is updated before scrolling
    requestAnimationFrame(() => {
      if (messagesContainerRef.current) {
        // Scroll the messages container to the bottom with smooth behavior
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    });
  };

  useEffect(() => {
    // Only scroll if there are messages to avoid scrolling on initial load
    if (messages.length > 0 || currentStreamingMessage) {
      scrollToBottom();
    }
  }, [messages, currentStreamingMessage]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/chatbot/messages?thread_id=${threadId}&order_by=created_at`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setMessages(data);
      setLoadedThreadId(threadId); // Mark this thread as loaded
    } catch (error) {
      console.error('Error loading messages:', error);
      setError(`Erro ao carregar mensagens: ${error.message}`);
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

    // Add user message immediately for better UX
    const userMessage = {
      id: Date.now().toString() + '_user_temp',
      user_message: messageContent,
      assistant_message: null,
      created_at: new Date().toISOString(),
      isUser: true, // This will render as user-only message
    };

    setMessages(prev => [...prev, userMessage]);

    let currentThreadId = threadId;
    let isNewThread = false;
    
    try {
      setIsStreaming(true);

      // Create new thread if none exists
      if (!currentThreadId) {
        const threadTitle = messageContent.length > 50 
          ? messageContent.substring(0, 50)
          : messageContent;
        currentThreadId = await createNewThread(threadTitle);
        isNewThread = true;
      }

      // Send message
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
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        
        const errorMessage = {
          id: Date.now().toString() + '_error',
          user_message: messageContent, // Include user message in error pair
          assistant_message: null,
          error_message: errorData.message || errorText,
          created_at: new Date().toISOString(),
          isUser: false, // This will render as message pair
        };
        
        // Replace the temporary user message with the error message pair
        setMessages(prev => {
          const filtered = prev.filter(msg => msg.id !== userMessage.id);
          return [...filtered, errorMessage];
        });
        return;
      }

      // Handle streaming response
      console.log('ChatInterface - Response body type:', typeof response.body);
      console.log('ChatInterface - Response body:', response.body);
      
      let assistantMessage = {
        id: Date.now().toString() + '_assistant',
        user_message: null,  // This is an assistant message, not user message
        assistant_message: null,
        error_message: null,
        created_at: new Date().toISOString(),
        isUser: false,
        generated_queries: [],
        steps: [],
      };

      setCurrentStreamingMessage(assistantMessage);

      let hasReceivedData = false;
      let responseText = '';

      // Check if response.body is a ReadableStream
      if (response.body && typeof response.body.getReader === 'function') {
        console.log('ChatInterface - Using ReadableStream');
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          const chunk = decoder.decode(value);
          responseText += chunk;
          console.log('ChatInterface - Received chunk:', chunk);
          
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr === '[DONE]') {
                setCurrentStreamingMessage(null);
                setMessages(prev => [...prev, assistantMessage]);
                
                // Notify parent about new thread only after successful message
                if (isNewThread) {
                  onNewThread(currentThreadId);
                }
                return;
              }
              
              try {
                const data = JSON.parse(dataStr);
                console.log('ChatInterface - Parsed data:', data);
                hasReceivedData = true;
                
                if (data.status === "running" && data.data) {
                  // Backend double-encodes step data as JSON string
                  let stepData;
                  if (typeof data.data === 'string') {
                    try {
                      stepData = JSON.parse(data.data);
                    } catch (e) {
                      console.log('ChatInterface - Error parsing step data:', e);
                      stepData = { label: 'Processing...', content: data.data };
                    }
                  } else {
                    stepData = data.data;
                  }
                  
                  // Accumulate steps instead of overwriting
                  const currentSteps = assistantMessage.steps || [];
                  assistantMessage = {
                    ...assistantMessage,
                    steps: [...currentSteps, stepData]
                  };
                  setCurrentStreamingMessage(assistantMessage);
                  
                } else if (data.status === "complete" && data.data) {
                  // Final response - create complete message pair
                  const completeMsgPair = {
                    id: data.data.id || assistantMessage.id,
                    user_message: messageContent, // Include user message in the pair
                    assistant_message: data.data.assistant_message,
                    error_message: data.data.error_message,
                    generated_queries: data.data.generated_queries || [],
                    steps: assistantMessage.steps || [],
                    created_at: new Date().toISOString(),
                    isUser: false, // This will render as message pair
                  };
                  
                  setCurrentStreamingMessage(null);
                  // Replace the temporary user message with the complete message pair
                  setMessages(prev => {
                    // Remove the temporary user message and add the complete pair
                    const filtered = prev.filter(msg => msg.id !== userMessage.id);
                    return [...filtered, completeMsgPair];
                  });
                  
                  // Update thread activity timestamp
                  if (onThreadActivity && currentThreadId) {
                    onThreadActivity(currentThreadId);
                  }
                  
                  // Notify parent about new thread only after successful message
                  if (isNewThread) {
                    onNewThread(currentThreadId);
                  }
                  return;
                }
              } catch (e) {
                console.log('ChatInterface - JSON parse error for line:', line, e);
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }
      } else {
        console.log('ChatInterface - Response is not a ReadableStream, reading as text');
        // Handle as regular response
        const responseText = await response.text();
        console.log('ChatInterface - Full response text:', responseText);
        
        // Try to parse as JSON - handle backend's streaming format in non-streaming response
        try {
          // Backend might send multiple JSON objects separated by \n\n
          const jsonLines = responseText.split('\n\n').filter(line => line.trim());
          let finalData = null;
          let allSteps = [];
          
          for (const line of jsonLines) {
            try {
              const data = JSON.parse(line);
              if (data.status === "running" && data.data) {
                // Parse step data (might be double-encoded)
                let stepData;
                if (typeof data.data === 'string') {
                  try {
                    stepData = JSON.parse(data.data);
                  } catch (e) {
                    stepData = { label: 'Processing...', content: data.data };
                  }
                } else {
                  stepData = data.data;
                }
                allSteps.push(stepData);
              } else if (data.status === "complete" && data.data) {
                finalData = data.data;
              }
            } catch (lineParseError) {
              console.log('ChatInterface - Error parsing line:', lineParseError);
            }
          }
          
          if (finalData) {
            const finalMessage = {
              id: finalData.id || assistantMessage.id,
              user_message: messageContent, // Include user message in the pair
              assistant_message: finalData.assistant_message,
              error_message: finalData.error_message,
              generated_queries: finalData.generated_queries || [],
              steps: allSteps,
              created_at: new Date().toISOString(),
              isUser: false, // This will render as message pair
            };
            setCurrentStreamingMessage(null);
            // Replace the temporary user message with the complete message pair
            setMessages(prev => {
              const filtered = prev.filter(msg => msg.id !== userMessage.id);
              return [...filtered, finalMessage];
            });
            
            // Update thread activity timestamp
            if (onThreadActivity && currentThreadId) {
              onThreadActivity(currentThreadId);
            }
            
            // Notify parent about new thread only after successful message
            if (isNewThread) {
              onNewThread(currentThreadId);
            }
            return;
          }
        } catch (e) {
          console.log('ChatInterface - Response is not JSON:', e);
        }
        
        // If we get here, treat as error
        const errorMessage = {
          id: Date.now().toString() + '_parse_error',
          user_message: messageContent, // Include user message in error pair
          assistant_message: null,
          error_message: responseText || 'Unknown response format',
          created_at: new Date().toISOString(),
          isUser: false, // This will render as message pair
          generated_queries: [],
          steps: [],
        };
        setCurrentStreamingMessage(null);
        // Replace the temporary user message with the error message pair
        setMessages(prev => {
          const filtered = prev.filter(msg => msg.id !== userMessage.id);
          return [...filtered, errorMessage];
        });
        
        // Notify parent about new thread even on error
        if (isNewThread) {
          onNewThread(currentThreadId);
        }
        return;
      }

      // If we didn't receive any proper streaming data, check if we got an error message
      if (!hasReceivedData && responseText.trim()) {
        console.log('ChatInterface - No streaming data received, checking for error message:', responseText);
        
        // Try to parse as JSON first
        let errorMessage;
        try {
          const parsedData = JSON.parse(responseText.trim());
          if (parsedData.error || parsedData.message) {
            // It's a structured error response
            errorMessage = {
              ...assistantMessage,
              assistant_message: null,
              error_message: parsedData.message || parsedData.error,
              created_at: new Date().toISOString(),
            };
          } else if (parsedData.assistant_message) {
            // It's a complete message response (non-streaming)
            const finalMessage = {
              ...assistantMessage,
              ...parsedData,
              created_at: new Date().toISOString(),
            };
            setCurrentStreamingMessage(null);
            setMessages(prev => [...prev, finalMessage]);
            
            // Notify parent about new thread only after successful message
            if (isNewThread) {
              onNewThread(currentThreadId);
            }
            
            return;
          }
        } catch (e) {
          // Not JSON, treat as plain text error
          errorMessage = {
            ...assistantMessage,
            assistant_message: null,
            error_message: responseText.trim(),
            created_at: new Date().toISOString(),
          };
        }
        
        if (errorMessage) {
          setCurrentStreamingMessage(null);
          setMessages(prev => [...prev, errorMessage]);
          
          // Notify parent about new thread even on error
          if (isNewThread) {
            onNewThread(currentThreadId);
          }
          
          return;
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Erro ao enviar mensagem. Tente novamente.');
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsStreaming(false);
      setCurrentStreamingMessage(null);
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
      console.error('Error sending feedback:', error);
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
        ref={messagesContainerRef}
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
              onFeedback={handleFeedback}
            />
          ))}

          {currentStreamingMessage && (
            <MessageBubble
              message={currentStreamingMessage}
              isStreaming={true}
            />
          )}
          
          {/* Invisible element to scroll to */}
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
            {isStreaming ? <Spinner size="sm" /> : t('send')}
          </Button>
        </HStack>
      </Box>
    </Box>
  );
} 