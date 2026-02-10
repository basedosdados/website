import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useChatbotAuth from './useChatbotAuth';

export default function useThreads() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { getAccessToken } = useChatbotAuth();

  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const fetchThreads = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const accessToken = await getAccessToken();
      const { data } = await axios.get(`${apiUrl}/chatbot/threads/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setThreads(data);
    } catch (err) {
      setError(err);
      console.error("Error fetching threads:", err);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, getAccessToken]);

  const deleteThread = async (threadId) => {
    try {
      setIsDeleting(true);
      setError(null);
      const accessToken = await getAccessToken();
      await axios.delete(`${apiUrl}/chatbot/threads/${threadId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      await fetchThreads();
    } catch (err) {
      setError(err);
      console.error("Error deleting thread:", err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  return {
    data: threads,
    threads,
    isLoading,
    error,
    refetch: fetchThreads,
    deleteThread,
    isDeleting,
  };
}