import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box, VStack, HStack, Text, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import cookies from "js-cookie";

// Prevent any automatic scrolling on the chatbot page
if (typeof window !== 'undefined') {
  // Override scrollIntoView to do nothing
  const originalScrollIntoView = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function() {
    // Do nothing - prevent all automatic scrolling
    return;
  };
}

import { MainPageTemplate } from "../../components/templates/main";
import ChatInterface from "../../components/organisms/Chatbot/ChatInterface";
import ChatHistory from "../../components/organisms/Chatbot/ChatHistory";
import TitleText from "../../components/atoms/Text/TitleText";
import BodyText from "../../components/atoms/Text/BodyText";

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
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const checkAccess = async () => {
      const userBD = cookies.get('userBD');
      const token = cookies.get('token');
      
      if (!userBD || !token) {
        router.push(`/user/login?redirect=${encodeURIComponent('/chatbot')}`);
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
          router.push(`/user/login?redirect=${encodeURIComponent('/chatbot')}`);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to check access');
        }

        const userInfo = await response.json();
        
        if (!userInfo.hasChatbotAccess) {
          router.push('/chatbot/access-denied');
          return;
        }

        setHasAccess(true);
      } catch (error) {
        console.error('Error checking access:', error);
        router.push(`/user/login?redirect=${encodeURIComponent('/chatbot')}`);
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [router]);

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
    return null; // Will redirect to access-denied
  }

  return (
    <MainPageTemplate>
      <Box 
        maxWidth="1440px" 
        margin="0 auto" 
        width="100%"
        style={{ scrollBehavior: 'auto' }} // Prevent smooth scrolling
      >
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Box>
            <TitleText typography="large" fontWeight="600" color="#252A32">
              {t('title')}
            </TitleText>
            <BodyText typography="medium" color="#616161" marginTop="8px">
              {t('subtitle')}
            </BodyText>
          </Box>

          {/* Chat Interface */}
          <HStack spacing={6} align="flex-start" height="calc(100vh - 300px)">
            {/* Sidebar - Thread History */}
            <Box width="300px" flexShrink={0} height="100%">
              <ChatHistory 
                selectedThreadId={selectedThreadId}
                onThreadSelect={setSelectedThreadId}
                refreshTrigger={refreshTrigger}
              />
            </Box>

            {/* Main Chat Area */}
            <Box flex={1} height="100%">
              <ChatInterface 
                threadId={selectedThreadId}
                onNewThread={(newThreadId) => {
                  setSelectedThreadId(newThreadId);
                  setRefreshTrigger(prev => prev + 1);
                }}
              />
            </Box>
          </HStack>
        </VStack>
      </Box>
    </MainPageTemplate>
  );
} 