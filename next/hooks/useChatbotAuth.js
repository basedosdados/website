import { useCallback } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

const ValidateTokenStaleTimeMs = 60 * 1000;

export default function useChatbotAuth() {
  const queryClient = useQueryClient();

  const validateToken = useCallback(async () => {
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ['validateToken'],
        queryFn: async () => {
          const response = await axios.get('/api/user/validateToken');
          return response.data.success;
        },
        staleTime: ValidateTokenStaleTimeMs,
      });
      return data;
    } catch (e) {
      console.error('Token validation failed:', e);
      return false;
    }
  }, [queryClient]);

  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.get('/api/user/refreshToken');
      return response.data.success;
    } catch (e) {
      console.error('Token refresh failed:', e);
      return false;
    }
  }, []);

  const invalidateSessionCache = useCallback(() => {
    queryClient.removeQueries({ queryKey: ['validateToken'] });
    queryClient.removeQueries({ queryKey: ['chatbotThreads'] });
  }, [queryClient]);

  const ensureSession = useCallback(async () => {
    const isValid = await validateToken();
    if (isValid) return true;

    const refreshed = await refreshToken();
    if (refreshed) {
      invalidateSessionCache();
      return validateToken();
    }

    invalidateSessionCache();
    return false;
  }, [validateToken, refreshToken, invalidateSessionCache]);

  const getAccessToken = useCallback(async () => {
    const ok = await ensureSession();
    return ok ? true : null;
  }, [ensureSession]);

  return {
    getAccessToken,
    ensureSession,
    validateToken,
    refreshToken,
    invalidateSessionCache,
  };
}
