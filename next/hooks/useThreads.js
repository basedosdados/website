import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useChatbotAuth from './useChatbotAuth';

function isAuthFailure(error) {
  const status = error?.response?.status;
  return status === 401 || status === 403;
}

export default function useThreads() {
  const { getAccessToken, invalidateSessionCache } = useChatbotAuth();
  const queryClient = useQueryClient();

  const {
    data: threads = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['chatbotThreads'],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        invalidateSessionCache();
        throw new Error('Sessão não autorizada');
      }
      try {
        const { data } = await axios.get('/api/chatbot/threads');
        return data;
      } catch (err) {
        if (isAuthFailure(err)) {
          invalidateSessionCache();
        }
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: async (threadId) => {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        invalidateSessionCache();
        throw new Error('Sessão não autorizada');
      }
      try {
        await axios.delete(`/api/chatbot/threads`, {
          params: { id: threadId },
        });
      } catch (err) {
        if (isAuthFailure(err)) {
          invalidateSessionCache();
        }
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chatbotThreads']);
    },
  });

  return {
    data: threads,
    threads,
    isLoading: isLoading || deleteMutation.isLoading,
    error,
    refetch,
    deleteThread: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isLoading,
  };
}
