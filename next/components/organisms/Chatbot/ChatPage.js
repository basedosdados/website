import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { Box, VStack, HStack, Input, Button, Text, Spinner, Alert, AlertIcon, Fade } from "@chakra-ui/react";
import MessageBubble from "./MessageBubble";
import StreamingThoughts from "./StreamingThoughts";
import BodyText from "../../atoms/Text/BodyText";

export default function ChatPage({ threadId, threadTitle, onThreadUpdate, onDeleteThread, onNewThread, focusInput, onFocusInputUsed }) {
  const { t } = useTranslation('chatbot');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState(null);
  const [streamingThoughts, setStreamingThoughts] = useState([]);
  const [currentStreamingStep, setCurrentStreamingStep] = useState(null);
  const [showThoughts, setShowThoughts] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Load messages when component mounts or threadId changes
  const loadMessages = useCallback(async (targetThreadId) => {
    if (!targetThreadId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/chatbot/messages?thread_id=${targetThreadId}&order_by=created_at`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError(`Erro ao carregar mensagens: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load messages when threadId changes
  useEffect(() => {
    if (threadId) {
      loadMessages(threadId);
    } else {
      setMessages([]);
    }
  }, [threadId, loadMessages]);

  // Auto-focus input when component mounts or when focusInput prop changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        if (focusInput && onFocusInputUsed) {
          onFocusInputUsed();
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [focusInput, onFocusInputUsed]);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    });
  }, []);

  useEffect(() => {
    if (messages.length > 0 || currentStreamingMessage) {
      scrollToBottom();
    }
  }, [messages, currentStreamingMessage, scrollToBottom]);

  const createNewThread = async (firstMessage = null) => {
    try {
      
      // Generate title from first message
      let title = 'Nova Conversa';
      if (firstMessage && firstMessage.trim()) {
        const words = firstMessage.trim().split(' ');
        title = words.slice(0, 4).join(' ');
        if (words.length > 4) {
          title += '...';
        }
      }
      
      const response = await fetch('/api/chatbot/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title
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
        throw new Error(`Failed to create thread: ${errorData.message || errorText}`);
      }

      const data = await response.json();
      const newThreadId = data.thread_id || data.id;
      
      // Notify parent about new thread
      if (onNewThread) {
        onNewThread(newThreadId, title);
      }
      
      return newThreadId;
    } catch (error) {
      console.error('ChatPage: Error creating thread:', error);
      setError('Failed to create new thread');
      throw error;
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isStreaming) return;

    const messageContent = inputMessage.trim();
    setInputMessage("");
    setError(null);

    // Add user message immediately with smooth animation
    const userMessage = {
      id: Date.now().toString() + '_user_temp',
      user_message: messageContent,
      assistant_message: null,
      created_at: new Date().toISOString(),
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    
    try {
      setIsStreaming(true);
      setStreamingThoughts([]);
      setCurrentStreamingStep(null);
      setShowThoughts(true);

      // If no threadId, create a new thread first
      let currentThreadId = threadId;
      if (!currentThreadId) {
        currentThreadId = await createNewThread(messageContent);
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
          user_message: messageContent,
          assistant_message: null,
          error_message: errorData.message || errorText,
          created_at: new Date().toISOString(),
          isUser: false,
        };
        
        setMessages(prev => {
          const filtered = prev.filter(msg => msg.id !== userMessage.id);
          return [...filtered, errorMessage];
        });
        return;
      }

      // Handle streaming response
      let assistantMessage = {
        id: Date.now().toString() + '_assistant',
        user_message: null,
        assistant_message: t('processing'),
        error_message: null,
        created_at: new Date().toISOString(),
        isUser: false,
        generated_queries: [],
        steps: [],
      };

      setCurrentStreamingMessage(assistantMessage);

      // Check if response.body is a ReadableStream
      if (response.body && typeof response.body.getReader === 'function') {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              
              if (dataStr === '[DONE]') {
                setCurrentStreamingMessage(null);
                break;
              }
              
              try {
                const data = JSON.parse(dataStr);
                
                if (data.status === "running" && data.data) {
                  // Parse step data
                  let stepData;
                  if (typeof data.data === 'string') {
                    try {
                      stepData = JSON.parse(data.data);
                    } catch (e) {
                      stepData = { label: t('processing'), content: data.data };
                    }
                  } else {
                    stepData = data.data;
                  }
                  
                  // Update streaming thoughts
                  setStreamingThoughts(prev => [...prev, stepData]);
                  setCurrentStreamingStep(stepData);
                  
                  // Update streaming message with steps and content
                  setCurrentStreamingMessage(prev => ({
                    ...prev,
                    steps: [...(prev?.steps || []), stepData],
                    assistant_message: stepData.content || prev?.assistant_message || t('processing')
                  }));
                  
                } else if (data.type === "final_answer" && data.data) {
                  // Update streaming message with the final answer
                  setCurrentStreamingMessage(prev => ({
                    ...prev,
                    assistant_message: data.data.content || prev?.assistant_message || t('processing')
                  }));
                  
                  // Capture the current streaming thoughts before clearing them
                  const currentSteps = [...streamingThoughts];
                  
                  // If this is the final answer, create the complete message pair
                  const completeMsgPair = {
                    id: data.data.run_id || assistantMessage.id,
                    user_message: messageContent,
                    assistant_message: data.data.content,
                    error_message: null,
                    generated_queries: [],
                    steps: currentSteps,
                    created_at: new Date().toISOString(),
                    isUser: false,
                  };
                  
                  setCurrentStreamingMessage(null);
                  setStreamingThoughts([]);
                  setCurrentStreamingStep(null);
                  setMessages(prev => {
                    const filtered = prev.filter(msg => msg.id !== userMessage.id);
                    return [...filtered, completeMsgPair];
                  });
                  
                  // Notify parent about thread activity
                  if (onThreadUpdate) {
                    setTimeout(() => {
                      onThreadUpdate(threadId);
                    }, 100);
                  }
                  
                  // Auto-focus input after final answer
                  setTimeout(() => {
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }, 200);
                  
                  return;
                  
                } else if (data.type === "complete" && data.data) {
                  // Capture the current streaming thoughts before clearing them
                  const currentSteps = [...streamingThoughts];
                  
                  // Final response - create complete message pair
                  const completeMsgPair = {
                    id: data.data.id || assistantMessage.id,
                    user_message: messageContent,
                    assistant_message: data.data.assistant_message,
                    error_message: data.data.error_message,
                    generated_queries: data.data.generated_queries || [],
                    steps: currentSteps,
                    created_at: new Date().toISOString(),
                    isUser: false,
                  };
                  
                  setCurrentStreamingMessage(null);
                  setStreamingThoughts([]);
                  setCurrentStreamingStep(null);
                  setMessages(prev => {
                    const filtered = prev.filter(msg => msg.id !== userMessage.id);
                    return [...filtered, completeMsgPair];
                  });
                  
                  // Notify parent about thread activity
                  if (onThreadUpdate) {
                    setTimeout(() => {
                      onThreadUpdate(threadId);
                    }, 100);
                  }
                  
                  // Auto-focus input after final answer
                  setTimeout(() => {
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }, 200);
                  
                  return;
                }
              } catch (e) {
              }
            }
          }
        }
      } else {
        // Handle non-streaming response
        const responseText = await response.text();
        
        try {
          const jsonLines = responseText.split('\n\n').filter(line => line.trim());
          let finalData = null;
          let allSteps = [];
          
          for (const line of jsonLines) {
            try {
              const data = JSON.parse(line);
              if (data.status === "running" && data.data) {
                let stepData;
                if (typeof data.data === 'string') {
                  try {
                    stepData = JSON.parse(data.data);
                  } catch (e) {
                    stepData = { label: t('processing'), content: data.data };
                  }
                } else {
                  stepData = data.data;
                }
                allSteps.push(stepData);
              } else if (data.status === "complete" && data.data) {
                finalData = data.data;
              }
            } catch (lineParseError) {
            }
          }
          
          if (finalData) {
            const finalMessage = {
              id: finalData.id || assistantMessage.id,
              user_message: messageContent,
              assistant_message: finalData.assistant_message,
              error_message: finalData.error_message,
              generated_queries: finalData.generated_queries || [],
              steps: allSteps,
              created_at: new Date().toISOString(),
              isUser: false,
            };
            
            setCurrentStreamingMessage(null);
            setStreamingThoughts([]);
            setCurrentStreamingStep(null);
            setMessages(prev => {
              const filtered = prev.filter(msg => msg.id !== userMessage.id);
              return [...filtered, finalMessage];
            });
            
            // Notify parent about thread activity
            if (onThreadUpdate) {
              setTimeout(() => {
                onThreadUpdate(threadId);
              }, 100);
            }
            
            // Auto-focus input after non-streaming response
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }, 200);
            
            return;
          }
        } catch (e) {
        }
        
        // If we get here, treat as error
        const errorMessage = {
          id: Date.now().toString() + '_parse_error',
          user_message: messageContent,
          assistant_message: null,
          error_message: responseText || 'Unknown response format',
          created_at: new Date().toISOString(),
          isUser: false,
          generated_queries: [],
          steps: [],
        };
        
        setCurrentStreamingMessage(null);
        setMessages(prev => {
          const filtered = prev.filter(msg => msg.id !== userMessage.id);
          return [...filtered, errorMessage];
        });
        
        return;
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Erro ao enviar mensagem. Tente novamente.');
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
      setStreamingThoughts([]);
      setCurrentStreamingStep(null);
    } finally {
      setIsStreaming(false);
      setCurrentStreamingMessage(null);
      
      // Auto-focus input after message completion
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
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
        <Fade in={!!error}>
          <Alert status="error" borderRadius="8px" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        </Fade>
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
            <Fade in={messages.length === 0 && !isStreaming}>
              <Box textAlign="center" padding={8}>
                <BodyText typography="medium" color="#616161">
                  {t('start_new_conversation')}
                </BodyText>
              </Box>
            </Fade>
          )}

          {messages.map((message, index) => {
            // Skip showing the temporary user message if we're streaming and it's the last message
            const isLastMessage = index === messages.length - 1;
            const isTemporaryUserMessage = message.isUser === true;
            const shouldHideTemporaryMessage = isTemporaryUserMessage && isLastMessage && isStreaming;
            
            if (shouldHideTemporaryMessage) {
              return null;
            }
            
            return (
              <Fade key={message.id} in={true}>
                <Box>
                  <MessageBubble
                    message={message}
                    onFeedback={handleFeedback}
                  />
                  
                  {/* Show streaming thoughts after the last user message */}
                  {isLastMessage && (isStreaming || streamingThoughts.length > 0) && (
                    <Box alignSelf="flex-start" maxWidth="80%" mt={2}>
                      <StreamingThoughts
                        steps={streamingThoughts}
                        isStreaming={isStreaming}
                        currentStep={currentStreamingStep}
                        isOpen={showThoughts}
                        onToggle={(isOpen) => setShowThoughts(isOpen)}
                      />
                    </Box>
                  )}
                </Box>
              </Fade>
            );
          })}

          {currentStreamingMessage && (
            <Fade in={!!currentStreamingMessage}>
              <Box>
                {/* Show the temporary user message above the streaming assistant message */}
                {messages.length > 0 && messages[messages.length - 1].isUser === true && (
                  <Box alignSelf="flex-end" maxWidth="80%" mb={2}>
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
                            {messages[messages.length - 1].user_message}
                          </BodyText>
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
                
                <MessageBubble
                  message={currentStreamingMessage}
                  isStreaming={true}
                />
              </Box>
            </Fade>
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
            autoFocus={true}
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
        
        {/* Disclaimer Text */}
        <VStack spacing={2} mt={3} align="start" ml={4}>
          <Text fontSize="xs" color="#666666" lineHeight="1.4">
            {t('disclaimer.warning')}
          </Text>
          <Text fontSize="xs" color="#666666" lineHeight="1.4">
            {t('disclaimer.privacy')}
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}
