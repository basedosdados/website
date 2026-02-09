import { useQuery } from 'react-query';
import axios from 'axios';
import useChatbotAuth from './useChatbotAuth';

export default function useThreads() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { getAccessToken } = useChatbotAuth();

  return useQuery('chatbot-threads', async () => {
    const accessToken = await getAccessToken();
    const { data } = await axios.get(`${apiUrl}/chatbot/threads/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  });
}