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
      const { data } = await axios.get('/api/chatbot/threads', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: async (threadId) => {
      const accessToken = await getAccessToken();
      await axios.delete(`/api/chatbot/threads`, {
        params: { id: threadId },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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