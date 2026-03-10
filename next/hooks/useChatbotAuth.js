import { useCallback } from 'react';
import axios from 'axios';
import cookies from 'js-cookie';

export default function useChatbotAuth() {
  const validateToken = useCallback(async (token) => {
    try {
      const response = await axios.get('/api/user/validateToken', {
        params: { p: btoa(token) }
      });
      return response.data.success;
    } catch (e) {
      return false;
    }
  }, []);

  const refreshToken = useCallback(async (token) => {
    try {
      const response = await axios.get('/api/user/refreshToken', {
        params: { p: btoa(token) }
      });
      return response.data.success;
    } catch (e) {
      console.error('Token refresh failed:', e);
      return false;
    }
  }, []);

  const getAccessToken = useCallback(async () => {
    const token = cookies.get('token');

    if (!token) return null;

    const isValid = await validateToken(token);
    if (isValid) return token;

    const refreshed = await refreshToken(token);
    if (refreshed) {
      return cookies.get('token');
    }

    return null;
  }, [validateToken, refreshToken]);

  return { getAccessToken };
}