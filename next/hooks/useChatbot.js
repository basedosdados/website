import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import cookies from 'js-cookie';
import useChatbotAuth from './useChatbotAuth';
import { useChatbotContext } from '../context/ChatbotContext';

export default function useChatbot(initialThreadId = null) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(initialThreadId);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const abortControllerRef = useRef(null);
  const charQueueRef = useRef([]);
  const isTypingRef = useRef(false);
  const currentBotMessageIdRef = useRef(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const { getAccessToken } = useChatbotAuth();
  const { refetch: refetchThreads } = useChatbotContext();

  const createThread = useCallback(async (firstMessage) => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        cookies.remove('chatbot_access_token');
        cookies.remove('chatbot_refresh_token');
        return null;
      }

      const title = firstMessage 
        ? (firstMessage.length > 30 ? `${firstMessage.substring(0, 30)}...` : firstMessage)
        : 'Nova conversa';

      const response = await axios.post(`${apiUrl}/chatbot/threads/`, { title }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const newThreadId = response.data.id;
      setThreadId(newThreadId);
      if (refetchThreads) refetchThreads();
      return newThreadId;
    } catch (err) {
      console.error('Failed to create thread:', err);
      setError('Falha ao iniciar conversa.');
      return null;
    }
  }, [apiUrl, getAccessToken]);

  const processQueue = useCallback(() => {
    if (charQueueRef.current.length > 0) {
      const charsToAppend = charQueueRef.current.splice(0, 2).join('');
      
      const botId = currentBotMessageIdRef.current;

      setMessages(prev => prev.map(msg => {
        if (msg.id !== botId) return msg;
        return { ...msg, content: (msg.content || '') + charsToAppend };
      }));

      setTimeout(() => processQueue(), 1);
    } else {
      isTypingRef.current = false;
      const botId = currentBotMessageIdRef.current;
      if (botId) {
        setMessages(prev => prev.map(msg => 
          msg.id === botId ? { ...msg, isTyping: false } : msg
        ));
      }
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
      let currentThreadId = threadId || await createThread(content);
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
        cookies.remove('chatbot_access_token');
        cookies.remove('chatbot_refresh_token');
        return;
      }

      const response = await fetch(`${apiUrl}/chatbot/threads/${currentThreadId}/messages/`, {
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
                setMessages(prev => prev.map(msg => 
                  msg.id === botMessageId 
                    ? { ...msg, toolCalls: [...(msg.toolCalls || []), event.data] }
                    : msg
                ));
                break;

              case 'tool_call':
                addToQueue(event.data?.content);
                break;

              case 'final_answer':
                addToQueue(event.data?.content);
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

      try {
        const tokenForId = await getAccessToken();
        if (tokenForId && currentThreadId) {
          const msgResponse = await axios.get(`${apiUrl}/chatbot/threads/${currentThreadId}/messages/`, {
            headers: { 'Authorization': `Bearer ${tokenForId}` },
          });
          const lastPair = msgResponse.data[msgResponse.data.length - 1];
          if (lastPair?.id) {
            const prevBotId = currentBotMessageIdRef.current;
            currentBotMessageIdRef.current = lastPair.id;
            setMessages(prev => prev.map(msg =>
              msg.id === prevBotId ? { ...msg, id: lastPair.id } : msg
            ));
          }
        }
      } catch (e) {
        console.error('Failed to fetch message pair ID:', e);
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
    }
  }, [threadId, createThread, getAccessToken, addToQueue]);

  const sendFeedback = useCallback(async (id, rating) => {
    try {
      if (!id) return;

      const accessToken = await getAccessToken();
      if (!accessToken) {
        cookies.remove('chatbot_access_token');
        cookies.remove('chatbot_refresh_token');
        return;
      }

      await axios.put(`${apiUrl}/chatbot/message-pairs/${id}/feedbacks/`, {
        rating: rating 
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      setMessages(prev => prev.map(msg => 
        msg.id === id ? { ...msg, rating: rating } : msg
      ));
      return true;
    } catch (err) {
      console.error('Failed to send feedback:', err);
      return false;
    }
  }, [getAccessToken, apiUrl]);

  const fetchThreadMessages = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const accessToken = await getAccessToken();
      if (!accessToken) {
        cookies.remove('chatbot_access_token');
        cookies.remove('chatbot_refresh_token');
        return;
      }

      const response = await axios.get(`${apiUrl}/chatbot/threads/${id}/messages/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
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
          .filter(ev => ev.type === 'tool_output')
          .map(ev => ev.data);

        formattedMessages.push({
          id: pair.id,
          role: 'assistant',
          content: pair.assistant_message,
          toolCalls: toolCalls,
          isLoading: false,
          isTyping: false,
          created_at: pair.created_at
        });
      });

      setMessages(formattedMessages);
      setThreadId(id);
    } catch (err) {
      console.error('Failed to fetch thread messages:', err);
      setError('Falha ao carregar histórico de mensagens.');
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, getAccessToken]);

  const resetChat = useCallback(() => {
    setThreadId(null);
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    isGenerating,
    threadId,
    error,
    sendMessage,
    createThread,
    fetchThreadMessages,
    sendFeedback,
    resetChat
  };
}
