import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box, VStack, HStack, Text, Spinner, Alert, AlertIcon, Button } from "@chakra-ui/react";
import cookies from "js-cookie";

import { MainPageTemplate } from "../../components/templates/main";
import ChatInterface from "../../components/organisms/Chatbot/ChatInterface";
import ChatHistory from "../../components/organisms/Chatbot/ChatHistory";
import TitleText from "../../components/atoms/Text/TitleText";
import BodyText from "../../components/atoms/Text/BodyText";
import LabelText from "../../components/atoms/Text/LabelText";
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
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [threadUpdateFunction, setThreadUpdateFunction] = useState(null);

  const handleReadDocs = () => {
    router.push('/docs/bot');
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
    // Show landing page instead of chat interface
    return <ChatbotLandingPage />;
  }

  return (
    <MainPageTemplate>
      <Box maxWidth="1440px" margin="0 auto" width="100%">
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Box>
            <HStack justify="space-between" align="flex-start">
              <Box>
                <TitleText typography="large" fontWeight="600" color="#252A32">
                  {t('title')}
                </TitleText>
                <BodyText typography="medium" color="#616161" marginTop="8px">
                  {t('subtitle')}
                </BodyText>
              </Box>
            </HStack>
          </Box>

          <Box marginTop="12px">
            <Button
              onClick={handleReadDocs}
              color="#3182CE"
              _hover={{ backgroundColor: "#E6F3FF" }}
              size="sm"
            >
              {t('documentation.read_docs')}
            </Button>
          </Box>

          {/* Chat Interface */}
          <HStack spacing={6} align="flex-start" height="calc(100vh - 300px)">
            {/* Sidebar - Thread History */}
            <Box width="300px" flexShrink={0}>
              <ChatHistory 
                selectedThreadId={selectedThreadId}
                onThreadSelect={setSelectedThreadId}
                onThreadUpdate={setThreadUpdateFunction}
              />
            </Box>

            {/* Main Chat Area */}
            <Box flex={1} height="100%">
              <ChatInterface 
                threadId={selectedThreadId}
                onNewThread={() => setSelectedThreadId(null)}
                onThreadActivity={threadUpdateFunction}
              />
            </Box>
          </HStack>


        </VStack>
      </Box>
    </MainPageTemplate>
  );
} 