import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box, VStack, HStack, Text, Alert, AlertIcon } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { MainPageTemplate } from "../../components/templates/main";
import TitleText from "../../components/atoms/Text/TitleText";
import BodyText from "../../components/atoms/Text/BodyText";
import Button from "../../components/atoms/Button";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu', 'chatbot'])),
    },
  };
}

export default function ChatbotAccessDenied() {
  const { t } = useTranslation('chatbot');
  const router = useRouter();

  return (
    <MainPageTemplate>
      <Box maxWidth="800px" margin="0 auto" width="100%">
        <VStack spacing={8} align="center" textAlign="center" py={12}>
          {/* Alert */}
          <Alert status="warning" borderRadius="8px" maxWidth="600px">
            <AlertIcon />
            <Text fontWeight="500">
              Acesso ao chatbot não autorizado
            </Text>
          </Alert>

          {/* Main Content */}
          <VStack spacing={6}>
            <TitleText typography="large" fontWeight="600" color="#252A32">
              Acesso Restrito
            </TitleText>
            
            <BodyText typography="medium" color="#616161" maxWidth="600px">
              O chatbot da Base dos Dados é uma funcionalidade exclusiva disponível para usuários autorizados. 
              Para solicitar acesso, entre em contato conosco.
            </BodyText>

            <BodyText typography="medium" color="#616161" maxWidth="600px">
              Envie um email para{' '}
              <Text as="span" color="blue.500" fontWeight="500">
                contato@basedosdados.org
              </Text>
              {' '}com o assunto "Solicitação de Acesso ao Chatbot" e informe:
            </BodyText>

            <Box 
              backgroundColor="#F8F9FA" 
              borderRadius="8px" 
              padding="24px" 
              width="100%" 
              maxWidth="500px"
              textAlign="left"
            >
              <VStack spacing={3} align="stretch">
                <BodyText typography="small" color="#616161">
                  • Seu nome completo
                </BodyText>
                <BodyText typography="small" color="#616161">
                  • Email da sua conta
                </BodyText>
                <BodyText typography="small" color="#616161">
                  • Instituição/organização
                </BodyText>
                <BodyText typography="small" color="#616161">
                  • Motivo do uso do chatbot
                </BodyText>
              </VStack>
            </Box>
          </VStack>

          {/* Action Buttons */}
          <HStack spacing={4}>
            <Button
              onClick={() => router.push('/')}
              backgroundColor="#FFFFFF"
              borderColor="#E2E8F0"
              borderWidth="1px"
              color="#252A32"
              _hover={{
                backgroundColor: "#F7FAFC",
                borderColor: "#CBD5E0"
              }}
            >
              Voltar ao Início
            </Button>
            
            <Button
              onClick={() => window.open('mailto:contato@basedosdados.org?subject=Solicitação de Acesso ao Chatbot', '_blank')}
              backgroundColor="#3182CE"
              color="white"
              _hover={{
                backgroundColor: "#2C5AA0"
              }}
            >
              Enviar Email
            </Button>
          </HStack>
        </VStack>
      </Box>
    </MainPageTemplate>
  );
} 