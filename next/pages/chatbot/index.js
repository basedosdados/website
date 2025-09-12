import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box, VStack, Text, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import cookies from "js-cookie";

import { MainPageTemplate } from "../../components/templates/main";
import ChatInterface from "../../components/organisms/Chatbot/ChatInterface";
import ChatbotLandingPage from "./landing";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu', 'chatbot'])),
    },
  };
}

export default function ChatbotPage() {
  const { t } = useTranslation('chatbot');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [user, setUser] = useState(null);

  const handleNewThread = (newThreadId, threadTitle) => {
    console.log('ChatbotPage: New thread created:', { newThreadId, threadTitle });
    // The ChatInterface component handles thread management internally
  };

  const handleThreadActivity = (threadId) => {
    console.log('ChatbotPage: Thread activity:', threadId);
    // The ChatInterface component handles thread updates internally
  };

  useEffect(() => {
    const checkAccess = async () => {
      const userBD = cookies.get('userBD');
      const token = cookies.get('token');
      
      if (!userBD || !token) {
        // User not logged in - show landing page
        setIsLoading(false);
        return;
      }

      try {
        const userData = JSON.parse(userBD);
        setUser(userData);

        // Extract the numeric ID from the user.id (e.g., "AccountNode:4" -> "4")
        const reg = new RegExp("(?<=:).*")
        const [ id ] = reg.exec(userData.id)

        // Check chatbot access through getUser API
        const response = await fetch(`/api/user/getUser?p=${btoa(id)}&q=${btoa(token)}`);
        
        if (response.status === 401) {
          // Token expired - show landing page
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to check access');
        }

        const userInfo = await response.json();
        
        if (userInfo.hasChatbotAccess) {
          setHasAccess(true);
        }
        // If no access, stay on landing page (hasAccess remains false)
      } catch (error) {
        console.error('Error checking access:', error);
        // On error, show landing page
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, []);

  if (isLoading) {
    return (
      <MainPageTemplate>
        <VStack spacing={8} justify="center" minHeight="400px">
          <Spinner size="xl" color="blue.500" />
          <Text>{t('loading')}</Text>
        </VStack>
      </MainPageTemplate>
    );
  }

  if (!hasAccess) {
    // Show landing page instead of chat interface
    return <ChatbotLandingPage />;
  }

  return (
    <MainPageTemplate>
      <Box height="calc(100vh - 120px)" width="100%" overflow="hidden" maxWidth="1400px" margin="0 auto">
        <ChatInterface 
          onNewThread={handleNewThread}
          onThreadActivity={handleThreadActivity}
        />
      </Box>
    </MainPageTemplate>
  );
}
