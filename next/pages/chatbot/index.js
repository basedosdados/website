import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box, VStack, HStack, Text, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import cookies from "js-cookie";

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

  useEffect(() => {
    const checkAccess = async () => {
      const userBD = cookies.get('userBD');
      
      if (!userBD) {
        router.push(`/user/login?redirect=${encodeURIComponent('/chatbot')}`);
        return;
      }

      try {
        const userData = JSON.parse(userBD);
        setUser(userData);

        // Check chatbot access through API
        const response = await fetch('/api/chatbot/auth');
        
        if (response.status === 401) {
          router.push(`/user/login?redirect=${encodeURIComponent('/chatbot')}`);
          return;
        }
        
        if (response.status === 403) {
          router.push('/chatbot/access-denied');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to check access');
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
      <Box maxWidth="1440px" margin="0 auto" width="100%">
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
            <Box width="300px" flexShrink={0}>
              <ChatHistory 
                selectedThreadId={selectedThreadId}
                onThreadSelect={setSelectedThreadId}
              />
            </Box>

            {/* Main Chat Area */}
            <Box flex={1} height="100%">
              <ChatInterface 
                threadId={selectedThreadId}
                onNewThread={() => setSelectedThreadId(null)}
              />
            </Box>
          </HStack>
        </VStack>
      </Box>
    </MainPageTemplate>
  );
} 