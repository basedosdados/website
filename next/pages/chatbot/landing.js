import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from "next/router";
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Button, 
  Badge, 
  Icon, 
  Spinner,
  List,
  ListItem,
  ListIcon
} from "@chakra-ui/react";
import { CheckIcon } from '@chakra-ui/icons';
import cookies from "js-cookie";

import { MainPageTemplate } from "../../components/templates/main";
import TitleText from "../../components/atoms/Text/TitleText";
import BodyText from "../../components/atoms/Text/BodyText";
import LabelText from "../../components/atoms/Text/LabelText";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu', 'chatbot'])),
    },
  };
}

export default function ChatbotLandingPage() {
  const { t } = useTranslation('chatbot');
  const router = useRouter();
  const [userState, setUserState] = useState('checking'); // 'not_logged_in', 'logged_in_no_access', 'checking'

  useEffect(() => {
    const checkUserState = () => {
      const userBD = cookies.get('userBD');
      const token = cookies.get('token');
      
      if (!userBD || !token) {
        setUserState('not_logged_in');
        return;
      }

      // User is logged in, but we don't need to check hasChatbotAccess here
      // since this component is only shown when user doesn't have access
      setUserState('logged_in_no_access');
    };

    checkUserState();
  }, []);

  const handleRequestAccess = () => {
    window.open('https://forms.gle/gYakxoU5ksA16vTq5', '_blank');
  };

  const handleLogin = () => {
    router.push(`/user/login?redirect=${encodeURIComponent('/chatbot')}`);
  };

  const handleReadDocs = () => {
    router.push('/docs/bot');
  };

  // Show loading while checking user state
  if (userState === 'checking') {
    return (
      <MainPageTemplate>
        <Box maxWidth="1200px" margin="0 auto" width="100%" padding={8}>
          <VStack spacing={8} justify="center" minHeight="400px">
            <Spinner size="xl" color="blue.500" />
            <Text>{t('loading')}</Text>
          </VStack>
        </Box>
      </MainPageTemplate>
    );
  }

  return (
    <MainPageTemplate>
      <Box maxWidth="1200px" margin="0 auto" width="100%" padding={8}>
        <VStack spacing={12} align="stretch">
          
          {/* Hero Section */}
          <Box textAlign="center" paddingY={12}>
            <VStack spacing={6}>
              <HStack spacing={4} justify="center">
                <TitleText typography="large" fontWeight="700" color="#252A32">
                  {t('landing.hero.title')}
                </TitleText>
                <Badge 
                  backgroundColor="#3182CE" 
                  color="white" 
                  paddingX={3} 
                  paddingY={1} 
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="600"
                >
                  {t('landing.hero.beta_badge')}
                </Badge>
              </HStack>
              
              <BodyText typography="large" color="#616161" maxWidth="600px">
                {t('landing.hero.subtitle')}
              </BodyText>
              
              <VStack spacing={3}>
                {userState === 'not_logged_in' ? (
                  <>
                    <Button
                      size="lg"
                      onClick={handleLogin}
                      backgroundColor="#3182CE"
                      color="white"
                      _hover={{
                        backgroundColor: "#2C5AA0"
                      }}
                      paddingX={8}
                      paddingY={4}
                      fontSize="lg"
                      fontWeight="600"
                    >
                      {t('landing.hero.access_bd_bot')}
                    </Button>
                    <BodyText typography="small" color="#616161">
                      {t('landing.hero.login_to_access')}
                    </BodyText>
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      onClick={handleRequestAccess}
                      backgroundColor="#3182CE"
                      color="white"
                      _hover={{
                        backgroundColor: "#2C5AA0"
                      }}
                      paddingX={8}
                      paddingY={4}
                      fontSize="lg"
                      fontWeight="600"
                    >
                      {t('landing.hero.cta_button')}
                    </Button>
                    <BodyText typography="small" color="#616161">
                      {t('landing.hero.cta_description')}
                    </BodyText>
                  </>
                )}
              </VStack>
            </VStack>
          </Box>

          {/* What is BD Chatbot Section */}
          <Box>
            <VStack spacing={6} align="stretch">
              <TitleText typography="large" fontWeight="600" color="#252A32">
                {t('landing.what_is.title')}
              </TitleText>
              
              <BodyText typography="medium" color="#616161" lineHeight="1.6">
                {t('landing.what_is.description')}
              </BodyText>
              
              {/* <Box 
                backgroundColor="#F8F9FA" 
                padding={4} 
                borderRadius="8px" 
                borderLeft="4px solid #3182CE"
              >
                <BodyText typography="medium" color="#252A32" fontWeight="500">
                  {t('landing.what_is.gemini_model')}
                </BodyText>
              </Box> */}
              
              <Box>
                <LabelText typography="medium" fontWeight="600" color="#252A32" marginBottom={3}>
                  {t('landing.what_is.key_benefits')}
                </LabelText>
                <List spacing={2}>
                  {t('landing.what_is.benefits', { returnObjects: true }).map((benefit, index) => (
                    <ListItem key={index}>
                      <HStack spacing={3}>
                        <ListIcon as={CheckIcon} color="#3182CE" />
                        <BodyText typography="medium" color="#616161">
                          {benefit}
                        </BodyText>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </VStack>
          </Box>

          {/* Key Features Section */}
          <Box>
            <VStack spacing={6} align="stretch">
              <TitleText typography="large" fontWeight="600" color="#252A32">
                {t('landing.features.title')}
              </TitleText>
              
              <HStack spacing={6} align="flex-start">
                <Box flex={1} backgroundColor="#F8F9FA" padding={6} borderRadius="8px">
                  <VStack spacing={3} align="flex-start">
                    <LabelText typography="medium" fontWeight="600" color="#252A32">
                      {t('landing.features.code_display.title')}
                    </LabelText>
                    <BodyText typography="small" color="#616161">
                      {t('landing.features.code_display.description')}
                    </BodyText>
                  </VStack>
                </Box>
                
                <Box flex={1} backgroundColor="#F8F9FA" padding={6} borderRadius="8px">
                  <VStack spacing={3} align="flex-start">
                    <LabelText typography="medium" fontWeight="600" color="#252A32">
                      {t('landing.features.feedback.title')}
                    </LabelText>
                    <BodyText typography="small" color="#616161">
                      {t('landing.features.feedback.description')}
                    </BodyText>
                  </VStack>
                </Box>
                
                <Box flex={1} backgroundColor="#F8F9FA" padding={6} borderRadius="8px">
                  <VStack spacing={3} align="flex-start">
                    <LabelText typography="medium" fontWeight="600" color="#252A32">
                      {t('landing.features.delete_chat.title')}
                    </LabelText>
                    <BodyText typography="small" color="#616161">
                      {t('landing.features.delete_chat.description')}
                    </BodyText>
                  </VStack>
                </Box>
              </HStack>
            </VStack>
          </Box>

          {/* Documentation Section */}
          <Box>
            <VStack spacing={6} align="stretch">
              <TitleText typography="large" fontWeight="600" color="#252A32">
                {t('documentation.title')}
              </TitleText>
              
              <BodyText 
                as="button"
                onClick={handleReadDocs}
                color="#3182CE"
                _hover={{ textDecoration: "underline" }}
                cursor="pointer"
                textAlign="left"
              >
                {t('documentation.read_docs')}
              </BodyText>
            </VStack>
          </Box>

          {/* Bottom CTA Section */}
          <Box textAlign="center" paddingY={8} backgroundColor="#F8F9FA" borderRadius="12px">
            <VStack spacing={4}>
              <TitleText typography="medium" fontWeight="600" color="#252A32">
                {t('landing.cta.ready_to_get_started')}
              </TitleText>
              {userState === 'not_logged_in' ? (
                <Button
                  size="lg"
                  onClick={handleLogin}
                  backgroundColor="#3182CE"
                  color="white"
                  _hover={{
                    backgroundColor: "#2C5AA0"
                  }}
                  paddingX={8}
                  paddingY={4}
                  fontSize="lg"
                  fontWeight="600"
                >
                  {t('landing.hero.access_bd_bot')}
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleRequestAccess}
                  backgroundColor="#3182CE"
                  color="white"
                  _hover={{
                    backgroundColor: "#2C5AA0"
                  }}
                  paddingX={8}
                  paddingY={4}
                  fontSize="lg"
                  fontWeight="600"
                >
                  {t('landing.hero.cta_button')}
                </Button>
              )}
            </VStack>
          </Box>
        </VStack>
      </Box>
    </MainPageTemplate>
  );
} 