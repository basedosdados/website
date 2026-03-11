import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import cookies from 'js-cookie';
import useChatbotAuth from './useChatbotAuth';
import { useChatbotContext } from '../context/ChatbotContext';
import { useRouter } from 'next/router';

export default function useChatbot(initialThreadId = null, options = {}) {
  const { onThreadCreated } = options;
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(initialThreadId);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();

  const handleAuthError = useCallback(() => {
    cookies.remove('token');
    cookies.remove('userBD');
    router.push('/user/login');
  }, [router]);

  const lastInitialThreadIdRef = useRef(initialThreadId);

  useEffect(() => {
    if (initialThreadId !== lastInitialThreadIdRef.current) {
      setThreadId(initialThreadId);
      if (!initialThreadId) {
        setMessages([]);
        queryClient.removeQueries({ queryKey: ['chatbotMessages'] });
      }
      lastInitialThreadIdRef.current = initialThreadId;
    }
  }, [initialThreadId, queryClient]);

  const abortControllerRef = useRef(null);
  const charQueueRef = useRef([]);
  const isTypingRef = useRef(false);
  const currentBotMessageIdRef = useRef(null);
  const animationFrameRef = useRef(null);

  const { getAccessToken } = useChatbotAuth();
  const { refetch: refetchThreads } = useChatbotContext();

  const historyQuery = useQuery({
    queryKey: ['chatbotMessages', threadId],
    queryFn: async () => {
      if (!threadId) return [];
      const accessToken = await getAccessToken();
      if (!accessToken) {
        handleAuthError();
        return [];
      }
      const response = await axios.get('/api/chatbot/messages', {
        params: { threadId },
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      const formattedMessages = [];
      response.data.forEach(pair => {
        formattedMessages.push({
          id: `user-${pair.id}`,
          role: 'user',
          content: pair.user_message,
          status: 'SUCCESS',
          created_at: pair.created_at
        });

        const toolCalls = (pair.events || [])
          .filter(ev => ev.type === 'tool_output' || ev.type === 'tool_call')
          .map(ev => ({ ...ev.data, type: ev.type }));

        formattedMessages.push({
          id: pair.id,
          role: 'assistant',
          content: pair.assistant_message,
          toolCalls: toolCalls,
          isLoading: false,
          isTyping: false,
          created_at: pair.created_at,
          rating: pair.feedback?.rating
        });
      });
      return formattedMessages;
    },
    enabled: !!threadId && !isGenerating,
    staleTime: 1000 * 60,
    keepPreviousData: false,
  });

  useEffect(() => {
    if (threadId && historyQuery.isSuccess && !isGenerating && !isTyping) {
      setMessages(historyQuery.data);
    } else if (!threadId && !isGenerating && !isTyping) {
      setMessages([]);
    }
  }, [threadId, historyQuery.data, historyQuery.isSuccess, isGenerating, isTyping]);

  const createThreadMutation = useMutation({
    mutationFn: async (firstMessage) => {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        handleAuthError();
        throw new Error('Unauthorized');
      }

      const title = firstMessage 
        ? (firstMessage.length > 30 ? `${firstMessage.substring(0, 30)}...` : firstMessage)
        : 'Nova conversa';

      const response = await axios.post('/api/chatbot/threads', { title }, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      return response.data.id;
    },
    onSuccess: (newThreadId) => {
      setThreadId(newThreadId);
      if (refetchThreads) refetchThreads();
      if (onThreadCreated) onThreadCreated(newThreadId);
    },
    onError: (err) => {
      console.error('Failed to create thread:', err);
      setError('Falha ao iniciar conversa.');
    }
  });

  const createThread = createThreadMutation.mutateAsync;

  const feedbackMutation = useMutation({
    mutationFn: async ({ id, rating }) => {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        handleAuthError();
        throw new Error('Unauthorized');
      }

      await axios.put('/api/chatbot/feedback', {
        rating: rating 
      }, {
        params: { messageId: id },
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      return { id, rating };
    },
    onSuccess: ({ id, rating }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === id ? { ...msg, rating: rating } : msg
      ));
    },
    onError: (err) => {
      console.error('Failed to send feedback:', err);
    }
  });

  const sendFeedback = (id, rating) => feedbackMutation.mutate({ id, rating });

  const processQueue = useCallback(() => {
    if (charQueueRef.current.length > 0) {
      const charsToAppend = charQueueRef.current.splice(0, 8).join('');
      const botId = currentBotMessageIdRef.current;

      setMessages(prev => prev.map(msg => {
        if (msg.id !== botId) return msg;
        return { ...msg, content: (msg.content || '') + charsToAppend };
      }));

      animationFrameRef.current = requestAnimationFrame(processQueue);
    } else {
      isTypingRef.current = false;
      setIsTyping(false);
      const botId = currentBotMessageIdRef.current;
      if (botId) {
        setMessages(prev => prev.map(msg => 
          msg.id === botId ? { ...msg, isTyping: false } : msg
        ));
      }
      animationFrameRef.current = null;
    }
  }, []);

  const addToQueue = useCallback((text) => {
    if (!text) return;

    const lineCount = text.split('\n').length;
    const botId = currentBotMessageIdRef.current;

    if (lineCount > 40) {
      setMessages(prev => prev.map(msg => {
        if (msg.id !== botId) return msg;
        const prefix = msg.content ? '\n\n' : '';
        return { ...msg, content: (msg.content || '') + prefix + text };
      }));

      charQueueRef.current = [];
      isTypingRef.current = false;

      return;
    }

    charQueueRef.current.push(...text.split(''));

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      setIsTyping(true);
      setMessages(prev => prev.map(msg => 
        msg.id === botId ? { ...msg, isTyping: true } : msg
      ));
      processQueue();
    }
  }, [processQueue]);

  const sendMessage = useCallback(async (content) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setIsGenerating(true);
    setError(null);
    charQueueRef.current = [];
    let currentThreadId = threadId;

    const userMessage = {
      id: `user-${crypto.randomUUID()}`,
      role: 'user',
      content: content,
      status: 'SUCCESS'
    };
    setMessages(prev => [...prev, userMessage]);

    const botMessageId = crypto.randomUUID();
    currentBotMessageIdRef.current = botMessageId;

    setMessages(prev => [...prev, {
      id: botMessageId,
      role: 'assistant',
      content: '',
      isLoading: true,
      isTyping: false,
      toolCalls: []
    }]);

    try {
      if (!currentThreadId) {
        currentThreadId = await createThread(content);
      }
      if (!currentThreadId) {
        setMessages(prev => prev.map(msg => 
          msg.id === botMessageId 
            ? { ...msg, isLoading: false, isError: true, content: 'Não foi possível iniciar uma conversa com o chatbot. Por favor, tente novamente.' } 
            : msg
        ));
        return;
      }

      const accessToken = await getAccessToken();
      if (!accessToken) { 
        handleAuthError();
        return;
      }

      const response = await fetch(`/api/chatbot/messages?threadId=${currentThreadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content, stream: true }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      if (!response.body) {
        throw new Error('Sem corpo na resposta');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (!done) {
          buffer += decoder.decode(value, { stream: true });
        }

        const lines = buffer.split('\n');
        buffer = done ? '' : (lines.pop() || '');

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);

            switch (event.type) {
              case 'tool_output':
              case 'tool_call':
                setMessages(prev => prev.map(msg => 
                  msg.id === botMessageId 
                    ? { ...msg, toolCalls: [...(msg.toolCalls || []), { ...event.data, type: event.type }] }
                    : msg
                ));
                break;

              case 'final_answer':
                if (event.data?.content) {
                  addToQueue(event.data.content);
                }
                break;

              case 'error':
                setMessages(prev => prev.map(msg => 
                  msg.id === botMessageId 
                    ? { ...msg, isError: true, isLoading: false, content: event.data?.error_details?.message }
                    : msg
                ));
                break;

              case 'complete':
                const completeId = event.data?.message_id || botMessageId;
                currentBotMessageIdRef.current = completeId;
                setMessages(prev => prev.map(msg => 
                  msg.id === botMessageId 
                    ? { 
                        ...msg, 
                        id: completeId, 
                        isLoading: false, 
                        runId: event.data?.run_id
                      }
                    : msg
                ));
                break;
            }
          } catch (e) {
            console.error('JSON Parse error', e);
          }
        }

        if (done) break;
      }

    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error(err);
      setError('Erro ao enviar mensagem.');
      setMessages(prev => prev.map(msg => 
        msg.id === currentBotMessageIdRef.current 
          ? { ...msg, isLoading: false, isError: true, content: 'Ocorreu um erro. Por favor, tente novamente.' } 
          : msg
      ));
    } finally {
      setIsLoading(false);
      setIsGenerating(false);

      const finalBotId = currentBotMessageIdRef.current || botMessageId;
      setMessages(prev => prev.map(msg =>
        msg.id === finalBotId
          ? { ...msg, isLoading: false }
          : msg
      ));

      if (currentThreadId) {
        queryClient.invalidateQueries({
          queryKey: ['chatbotMessages', currentThreadId]
        });
      }
    }
  }, [threadId, createThread, getAccessToken, addToQueue, queryClient]);

  const fetchThreadMessages = (id) => {
    if (id !== threadId) {
      setThreadId(id);
    }
  };

  const resetChat = useCallback(() => {
    queryClient.removeQueries({ queryKey: ['chatbotMessages'] });
    setThreadId(null);
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setIsGenerating(false);
    setIsTyping(false);
  }, [queryClient]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    messages,
    isLoading: isLoading || (!!threadId && historyQuery.isLoading),
    isGenerating,
    threadId,
    error: error || historyQuery.error,
    sendMessage,
    createThread,
    fetchThreadMessages,
    sendFeedback,
    resetChat
  };
}
