import { useState, useCallback } from 'react';
import axios from 'axios';
import cookies from 'js-cookie';

export default function useChatbot() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [error, setError] = useState(null);

  const apiUrl = "http://localhost:8000";

  const createThread = useCallback(async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/v1/chatbot/threads`, { title: 'New Conversation' });
      const newThreadId = response.data.id;
      setThreadId(newThreadId);
      return newThreadId;
    } catch (err) {
      console.error('Failed to create thread:', err);
      setError('Falha ao iniciar conversa.');
      return null;
    }
  }, []);

  const sendMessage = useCallback(async (content) => {
    setIsLoading(true);
    setError(null);

    const userMessageId = `user-${Date.now()}`;
    const userMessage = {
      id: userMessageId,
      role: 'user',
      content: content,
      status: 'SUCCESS'
    };
    setMessages(prev => [...prev, userMessage]);

    let currentThreadId = threadId;
    if (!currentThreadId) {
      currentThreadId = await createThread();
      if (!currentThreadId) {
        setIsLoading(false);
        return;
      }
    }

    try {
      const accessToken = cookies.get('token');
      const response = await fetch(`${apiUrl}/api/v1/chatbot/threads/${currentThreadId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content }),
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
      
      const botMessageId = `bot-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: botMessageId,
        role: 'assistant',
        content: '',
        isLoading: true
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;

          try {
            const event = JSON.parse(line);
            handleStreamEvent(event, botMessageId);
          } catch (e) {
            console.error('Error parsing JSON stream:', e);
          }
        }
      }

      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId ? { ...msg, isLoading: false } : msg
      ));

    } catch (err) {
      console.error(err);
      setError('Erro ao enviar mensagem.');
      setMessages(prev => prev.map(msg => 
        msg.role === 'assistant' && msg.isLoading ? { ...msg, isLoading: false, isError: true, content: 'Ocorreu um erro.' } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, [threadId, createThread]);

  const handleStreamEvent = (event, botMessageId) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== botMessageId) return msg;

      switch (event.type) {
        case 'tool_call':
          return { ...msg, toolCall: event.data };
        case 'tool_output':
          return { ...msg, toolCall: null };
        case 'final_answer':
          return { ...msg, content: (msg.content || '') + (event.data.content || '') };
        case 'error':
          return { ...msg, isError: true, content: event.data.error_details?.message || 'Erro no chatbot.' };
        case 'complete':
          return { ...msg, isLoading: false, runId: event.data.run_id };
        default:
          return msg;
      }
    }));
  };

  const sendFeedback = useCallback(async (messageId, rating) => {
    try {
      await axios.put(`${apiUrl}/api/v1/chatbot/messages/${messageId}/feedback`, { rating });
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, feedback: rating } : msg
      ));
    } catch (err) {
      console.error('Failed to send feedback:', err);
    }
  }, []);

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
