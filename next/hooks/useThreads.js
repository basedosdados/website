import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useChatbotAuth from './useChatbotAuth';

export default function useThreads() {
  const { getAccessToken } = useChatbotAuth();
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
        throw new Error('Sessão não autorizada');
      }
      const { data } = await axios.get('/api/chatbot/threads');
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: async (threadId) => {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error('Sessão não autorizada');
      }
      await axios.delete(`/api/chatbot/threads`, {
        params: { id: threadId },
      });
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
