import React, { useState, useEffect, useCallback } from "react";
import { Box, VStack, HStack, Text, Button, Spinner, Alert, AlertIcon, Fade, SlideFade } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

import BodyText from "../../atoms/Text/BodyText";
import LabelText from "../../atoms/Text/LabelText";

export default function ChatHistory({ selectedThreadId, onThreadSelect, onThreadUpdate, onFunctions }) {
  const { t } = useTranslation('chatbot');
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newThreadId, setNewThreadId] = useState(null);

  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/chatbot/threads?order_by=-created_at');
      
      if (!response.ok) {
        throw new Error('Failed to load threads');
      }

      const data = await response.json();
      // Add last_activity field defaulting to created_at
      const threadsWithActivity = data.map(thread => ({
        ...thread,
        last_activity: thread.last_activity || thread.created_at
      }));
      setThreads(threadsWithActivity);
    } catch (error) {
      console.error('Error loading threads:', error);
      setError(t('error_loading_conversations'));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update thread's last activity timestamp
  const updateThreadActivity = useCallback((threadId) => {
    setThreads(prev => {
      const updated = prev.map(thread => 
        thread.id === threadId 
          ? { ...thread, last_activity: new Date().toISOString() }
          : thread
      );
      // Sort by last_activity descending
      return updated.sort((a, b) => new Date(b.last_activity) - new Date(a.last_activity));
    });
  }, []);

  // Function to add a new thread to the local state with animation
  const addNewThread = useCallback((threadId, title) => {
    // Ensure both parameters are valid
    if (!threadId || !title) {
      console.error('Invalid parameters for addNewThread:', { threadId, title });
      return;
    }
    
    const newThread = {
      id: threadId,
      title: title,
      created_at: new Date().toISOString(),
      last_activity: new Date().toISOString()
    };
    
    console.log('ChatHistory: Adding new thread:', newThread);
    
    // Set the new thread ID for animation trigger
    setNewThreadId(threadId);
    
    setThreads(prev => {
      const updated = [newThread, ...prev];
      console.log('ChatHistory: Updated threads state:', updated);
      return updated;
    });

    // Clear the animation trigger after a short delay
    setTimeout(() => {
      setNewThreadId(null);
    }, 1000);
  }, []);

  // Expose the update function to parent
  useEffect(() => {
    if (onThreadUpdate) {
      onThreadUpdate(updateThreadActivity);
    }
  }, [onThreadUpdate, updateThreadActivity]);

  // Expose the functions to parent
  useEffect(() => {
    if (onFunctions) {
      onFunctions({
        refresh: loadThreads,
        addNewThread: addNewThread
      });
    }
  }, [onFunctions, addNewThread]);

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`/api/chatbot/threads/${threadId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete thread');
      }

      // Remove from local state with animation
      setThreads(prev => {
        const updated = prev.filter(thread => thread.id !== threadId);
        return updated;
      });
      
      // If this was the selected thread, clear selection
      if (selectedThreadId === threadId) {
        onThreadSelect(null);
      }
    } catch (error) {
      console.error('Error deleting thread:', error);
      setError('Erro ao excluir conversa');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('pt-BR', { 
        weekday: 'short' 
      });
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const truncateTitle = (title, maxLength = 30) => {
    // Ensure title is a valid string
    if (!title || typeof title !== 'string') {
      return 'New Chat';
    }
    return title.length > maxLength 
      ? title.substring(0, maxLength) + '...' 
      : title;
  };

  if (isLoading) {
    return (
      <Box height="100%" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="lg" color="blue.500" />
          <Text fontSize="sm" color="#616161">{t('loading_conversations')}</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box height="100%" display="flex" flexDirection="column">
      {/* Header */}
      <Box padding={4} borderBottom="1px solid #E2E8F0">
        <HStack justify="space-between" align="center">
          <LabelText typography="medium" fontWeight="600" color="#252A32">
            {t('conversations')}
          </LabelText>
          <Button
            size="sm"
            onClick={() => {
              console.log('ChatHistory: Nova Conversa button clicked, calling onThreadSelect(null)');
              onThreadSelect(null);
            }}
            backgroundColor="#3182CE"
            color="white"
            _hover={{
              backgroundColor: "#2C5AA0"
            }}
            transition="all 0.2s ease-in-out"
          >
            {t('new_conversation')}
          </Button>
        </HStack>
      </Box>

      {/* Error Alert */}
      {error && (
        <Fade in={!!error}>
          <Alert status="error" borderRadius="8px" margin={4}>
            <AlertIcon />
            <Text fontSize="sm">{error}</Text>
          </Alert>
        </Fade>
      )}

      {/* Threads List */}
      <Box 
        flex={1} 
        overflowY="auto" 
        padding={2}
        maxHeight="calc(100vh - 180px)"
        css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#a1a1a1',
          },
        }}
      >
        <VStack spacing={2} align="stretch">
          {threads.length === 0 ? (
            <Fade in={threads.length === 0}>
              <Box textAlign="center" padding={8}>
                <BodyText typography="small" color="#616161">
                  {t('no_conversations')}
                  <br />
                  {t('start_new_conversation')}
                </BodyText>
              </Box>
            </Fade>
          ) : (
            threads.map((thread, index) => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                isSelected={selectedThreadId === thread.id}
                isNew={newThreadId === thread.id}
                onSelect={() => onThreadSelect(thread.id)}
                onDelete={() => deleteThread(thread.id)}
                formatDate={formatDate}
                truncateTitle={truncateTitle}
                index={index}
              />
            ))
          )}
        </VStack>
      </Box>
    </Box>
  );
}

function ThreadItem({ thread, isSelected, isNew, onSelect, onDelete, formatDate, truncateTitle, index }) {
  // Ensure thread object has valid properties
  if (!thread || !thread.id) {
    console.error('Invalid thread object:', thread);
    return null;
  }
  
  return (
    <SlideFade
      in={true}
      offsetY={isNew ? -20 : 0}
      transition={{
        enter: { 
          duration: 0.5, 
          delay: isNew ? 0 : index * 0.05,
          ease: "easeOut"
        }
      }}
    >
      <Box
        padding={3}
        borderRadius="8px"
        backgroundColor={isSelected ? "#EBF8FF" : "transparent"}
        border={isSelected ? "1px solid #3182CE" : "1px solid transparent"}
        cursor="pointer"
        _hover={{
          backgroundColor: isSelected ? "#EBF8FF" : "#F7FAFC",
          borderColor: isSelected ? "#3182CE" : "#E2E8F0"
        }}
        onClick={onSelect}
        transition="all 0.2s ease-in-out"
        transform={isNew ? "scale(1.02)" : "scale(1)"}
        boxShadow={isNew ? "0 4px 12px rgba(49, 130, 206, 0.15)" : "none"}
        position="relative"
        overflow="hidden"
      >
        {/* New thread indicator */}
        {isNew && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            height="2px"
            background="linear-gradient(90deg, #3182CE, #63B3ED, #3182CE)"
            animation="shimmer 2s infinite"
          />
        )}
        
        <VStack spacing={2} align="stretch">
          <HStack justify="space-between" align="flex-start">
            <Box flex={1} minWidth={0}>
              <BodyText 
                typography="small" 
                fontWeight="500" 
                color="#252A32"
                noOfLines={2}
              >
                {truncateTitle(thread.title || 'Untitled')}
              </BodyText>
              <LabelText 
                typography="x-small" 
                color="#616161"
                marginTop="4px"
              >
                {formatDate(thread.last_activity || thread.created_at)}
              </LabelText>
            </Box>
            
            <Button
              size="xs"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              color="#616161"
              _hover={{
                backgroundColor: "#FED7D7",
                color: "#E53E3E"
              }}
              padding={1}
              minWidth="auto"
              transition="all 0.2s ease-in-out"
            >
              ×
            </Button>
          </HStack>
        </VStack>
      </Box>
    </SlideFade>
  );
}
