import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import cookies from 'js-cookie';
import useChatbotAuth from './useChatbotAuth';

export default function useChatbot() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const charQueueRef = useRef([]);
  const isTypingRef = useRef(false);
  const currentBotMessageIdRef = useRef(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const { getAccessToken } = useChatbotAuth();

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

      setTimeout(() => processQueue(), 15);
    } else {
      isTypingRef.current = false;
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
      processQueue();
    }
  }, [processQueue]);


  const sendMessage = useCallback(async (content) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    charQueueRef.current = [];

    const userMessage = {
      id: `user-${Date.now()}`,
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
      toolCalls: []
    }]);

    try {
      let currentThreadId = threadId || await createThread(content);
      if (!currentThreadId) return;

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
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

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
                    ? { ...msg, isError: true, content: event.data?.error_details?.message }
                    : msg
                ));
                break;

              case 'complete':
                setMessages(prev => prev.map(msg => 
                  msg.id === botMessageId 
                    ? { ...msg, isLoading: false, runId: event.data?.run_id }
                    : msg
                ));
                break;
            }
          } catch (e) {
            console.error('JSON Parse error', e);
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error(err);
      setError('Erro ao enviar mensagem.');
      setMessages(prev => prev.map(msg => 
        msg.id === currentBotMessageIdRef.current 
          ? { ...msg, isLoading: false, isError: true, content: 'Ocorreu um erro.' } 
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, [threadId, createThread, getAccessToken, addToQueue]);

  const sendFeedback = useCallback(async (clientMessageId, rating) => {
    try {
      const message = messages.find(m => m.id === clientMessageId);
      if (!message || !message.messagePairId) {
        console.error('Message pair ID not found for feedback');
        return;
      }

      const accessToken = await getAccessToken();
      if (!accessToken) {
        cookies.remove('chatbot_access_token');
        cookies.remove('chatbot_refresh_token');
        return;
      }

      await axios.post(`${apiUrl}/chatbot/message-pairs/${message.messagePairId}/feedbacks/`, {
        score: rating 
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      setMessages(prev => prev.map(msg => 
        msg.id === clientMessageId ? { ...msg, feedback: rating } : msg
      ));
    } catch (err) {
      console.error('Failed to send feedback:', err);
    }
  }, [messages, getAccessToken]);

  const resetChat = useCallback(() => {
    setThreadId(null);
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    createThread,
    sendFeedback,
    resetChat
  };
}
