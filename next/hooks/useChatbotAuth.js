import { useCallback } from 'react';
import axios from 'axios';
import cookies from 'js-cookie';

export default function useChatbotAuth() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const loginToChatbot = useCallback(async () => {
    try {
      const email = process.env.NEXT_PUBLIC_CHATBOT_EMAIL;
      const password = process.env.NEXT_PUBLIC_CHATBOT_PASSWORD;

      if (!email || !password) {
        console.error('Chatbot credentials not configured');
        return null;
      }

      const response = await axios.post(`${apiUrl}/chatbot/token/`, {
        email: email,
        password: password
      });

      const { access, refresh } = response.data;
      cookies.set('chatbot_token', access, { path: '/' });
      cookies.set('chatbot_refresh_token', refresh, { path: '/' });
      return access;
    } catch (e) {
      console.error('Chatbot auto-login failed:', e);
      return null;
    }
  }, [apiUrl]);

  const refreshToken = useCallback(async () => {
    try {
      const refresh = cookies.get('chatbot_refresh_token');
      if (!refresh) throw new Error('No refresh token');
      const response = await axios.post(`${apiUrl}/chatbot/token/refresh/`, { refresh });
      const newAccess = response.data.access;
      cookies.set('chatbot_token', newAccess, { path: '/' });
      return newAccess;
    } catch (e) {
      console.error('RefreshToken failed', e);
      return null;
    }
  }, [apiUrl]);

  const getAccessToken = useCallback(async () => {
    let token = cookies.get('chatbot_token');

    if (token) return token;

    token = await refreshToken();
    if (token) return token;

    token = await loginToChatbot();
    return token;
  }, [refreshToken, loginToChatbot]);

  return { getAccessToken };
}