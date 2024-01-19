
import {
  VStack,
  Box
} from "@chakra-ui/react";
import BodyText from "../components/atoms/BodyText";
import SectionText from "../components/atoms/SectionText";

export default function PrivacyPolicy() {

  return (
    <VStack
      display="flex"
      flexDirection="column"
      spacing={0}
      alignItems="start"
      gap="24px"
    >
      <SectionText fontSize="16px">Bem-vindo à Base dos Dados ("Nós", "Nosso" ou "Nossos"). Comprometemo-nos a proteger e respeitar sua privacidade e cumprir todas as obrigações estabelecidas na Lei Geral de Proteção de Dados ("LGPD").</SectionText>
      <SectionText fontSize="16px">Esta Política de Privacidade descreve como coletamos, usamos, compartilhamos e protegemos suas informações pessoais. Ao acessar ou usar nossos serviços, você concorda com os termos e práticas descritos nesta Política de Privacidade.</SectionText>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <BodyText fontWeight="500">1. Informações que Coletamos</BodyText>
        <Box>
          <SectionText>1.1. Coletamos informações pessoais que você nos fornece diretamente ao usar nossos serviços. Isso pode incluir seu nome, endereço de e-mail, informações de pagamento e outras informações que você escolher compartilhar conosco.</SectionText>
          <SectionText>1.2. Também coletamos informações de forma automática, incluindo dados de uso, endereço IP, tipo de navegador, e informações sobre o dispositivo que você usa para acessar nossos serviços.</SectionText>
        </Box>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <BodyText fontWeight="500">2. Uso das Informações</BodyText>
        <Box>
          <SectionText>2.1. Utilizamos suas informações pessoais para fornecer e melhorar nossos serviços, incluindo o processamento de pagamentos, o fornecimento de suporte ao cliente e a personalização da experiência do usuário.</SectionText>
          <SectionText>2.2. Não venderemos, alugaremos ou compartilharemos suas informações pessoais com terceiros não afiliados sem o seu consentimento explícito.</SectionText>
        </Box>
      </VStack>
    
      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <BodyText fontWeight="500">3. Cookies e Tecnologias Semelhantes</BodyText>
        <SectionText>3.1. Utilizamos cookies e outras tecnologias semelhantes para coletar informações de uso e facilitar sua experiência de navegação em nossos serviços. Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.</SectionText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <BodyText fontWeight="500">4. Segurança das Informações</BodyText>
        <SectionText>4.1. Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado e uso indevido.</SectionText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <BodyText fontWeight="500">5. Seus Direitos</BodyText>
        <SectionText>5.1. De acordo com a LGPD, você tem direito de acessar, retificar, excluir ou portar seus dados pessoais. Se você deseja exercer esses direitos ou tiver alguma dúvida sobre como suas informações estão sendo tratadas, entre em contato conosco através do endereço de e-mail contato@basedosdados.org.</SectionText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <BodyText fontWeight="500">6. Alterações nesta Política de Privacidade</BodyText>
        <SectionText>6.1. Reservamo-nos o direito de atualizar esta Política de Privacidade periodicamente. As alterações serão publicadas em nosso site, e a data da última atualização será revisada. Recomendamos que você revise esta Política regularmente para se manter informado sobre nossas práticas de privacidade.</SectionText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <BodyText fontWeight="500">7. Contato</BodyText>
        <SectionText>7.1. Para quaisquer perguntas ou preocupações relacionadas à nossa Política de Privacidade, entre em contato conosco através do endereço de e-mail contato@basedosdados.org.</SectionText>
      </VStack>

      <SectionText fontSize="16px">Esta Política de Privacidade foi elaborada de acordo com as disposições da LGPD e visa garantir que suas informações pessoais sejam tratadas com o devido respeito e cuidado.</SectionText>
    </VStack>
  )
}