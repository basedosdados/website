
import {
  VStack,
  Box
} from "@chakra-ui/react";
import BodyText from "../components/atoms/BodyText";
import SectionText from "../components/atoms/SectionText";

export default function PrivacyPolicy() {
  const TitleText = ({ children, ...props }) => {
    return (
      <BodyText
        fontSize="18px"
        fontWeight="700"
        fontFamily="ubuntu"
        {...props}
      >
        {children}
      </BodyText>
    )
  }

  const SecText = ({ children, ...props }) => {
    return (
      <SectionText
        fontFamily="ubuntu"
        fontSize="18px"
        color="#6F6F6F"
        {...props}
      >
        {children}
      </SectionText>
    )
  }

  return (
    <VStack
      display="flex"
      flexDirection="column"
      spacing={0}
      alignItems="start"
      gap="40px"
    >
      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <SecText>Bem-vindo à Base dos Dados ("Nós", "Nosso" ou "Nossos"). Comprometemo-nos a proteger e respeitar sua privacidade e cumprir todas as obrigações estabelecidas na Lei Geral de Proteção de Dados ("LGPD").</SecText>
        <SecText>Esta Política de Privacidade descreve como coletamos, usamos, compartilhamos e protegemos suas informações pessoais. Ao acessar ou usar nossos serviços, você concorda com os termos e práticas descritos nesta Política de Privacidade.</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>1. Informações que Coletamos</TitleText>
        <Box>
          <SecText>1.1. Coletamos informações pessoais que você nos fornece diretamente ao usar nossos serviços. Isso pode incluir seu nome, endereço de e-mail, informações de pagamento e outras informações que você escolher compartilhar conosco.</SecText>
          <SecText>1.2. Também coletamos informações de forma automática, incluindo dados de uso, endereço IP, tipo de navegador, e informações sobre o dispositivo que você usa para acessar nossos serviços.</SecText>
        </Box>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>2. Uso das Informações</TitleText>
        <Box>
          <SecText>2.1. Utilizamos suas informações pessoais para fornecer e melhorar nossos serviços, incluindo o processamento de pagamentos, o fornecimento de suporte ao cliente e a personalização da experiência do usuário.</SecText>
          <SecText>2.2. Não venderemos, alugaremos ou compartilharemos suas informações pessoais com terceiros não afiliados sem o seu consentimento explícito.</SecText>
        </Box>
      </VStack>
    
      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>3. Cookies e Tecnologias Semelhantes</TitleText>
        <SecText>3.1. Utilizamos cookies e outras tecnologias semelhantes para coletar informações de uso e facilitar sua experiência de navegação em nossos serviços. Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>4. Segurança das Informações</TitleText>
        <SecText>4.1. Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado e uso indevido.</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>5. Seus Direitos</TitleText>
        <SecText>5.1. De acordo com a LGPD, você tem direito de acessar, retificar, excluir ou portar seus dados pessoais. Se você deseja exercer esses direitos ou tiver alguma dúvida sobre como suas informações estão sendo tratadas, entre em contato conosco através do endereço de e-mail contato@basedosdados.org.</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>6. Alterações nesta Política de Privacidade</TitleText>
        <SecText>6.1. Reservamo-nos o direito de atualizar esta Política de Privacidade periodicamente. As alterações serão publicadas em nosso site, e a data da última atualização será revisada. Recomendamos que você revise esta Política regularmente para se manter informado sobre nossas práticas de privacidade.</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>7. Contato</TitleText>
        <SecText>7.1. Para quaisquer perguntas ou preocupações relacionadas à nossa Política de Privacidade, entre em contato conosco através do endereço de e-mail contato@basedosdados.org.</SecText>
      </VStack>

      <SecText>Esta Política de Privacidade foi elaborada de acordo com as disposições da LGPD e visa garantir que suas informações pessoais sejam tratadas com o devido respeito e cuidado.</SecText>
    </VStack>
  )
}