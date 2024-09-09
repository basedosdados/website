
import {
  VStack,
  Box
} from "@chakra-ui/react";
import BodyText from "../components/atoms/BodyText";
import SectionText from "../components/atoms/SectionText";

export default function ServiceTerms() {
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
        <TitleText>1. Aceitação dos Termos</TitleText>
        <SecText>Ao acessar ou usar os serviços oferecidos pela Base dos Dados ("Nós", "Nosso" ou "Nossos"), você concorda em cumprir e aceitar estes Termos de Serviço. Se você não concordar com todos os termos e condições deste acordo, não poderá utilizar nossos serviços.</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>2. Descrição do Serviço</TitleText>
        <SecText>2.1. Nossos serviços consistem em uma assinatura mensal que concede aos seus assinantes o acesso a diversos dados exclusivos, harmonizados e atualizados na plataforma da Base dos Dados. O acesso se dá via os pacotes Python ou R da Base dos Dados, ou via BigQuery, serviço de armazenamento de dados de baixo custo e totalmente gerenciado do Google para análises.</SecText>
      </VStack>
    
      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>3. Pagamento e Assinaturas</TitleText>
        <Box>
          <SecText>3.1. Ao fazer a assinatura, você concorda em pagar a taxa mensal especificada. O pagamento será processado automaticamente a cada mês, a menos que você cancele sua assinatura antes da data de renovação, devidamente explicita na contratação do serviço.</SecText>
          <SecText>3.2. Ao fazer a assinatura, você concorda que seus dados sejam utilizados na criação e manutenção de usuários na plataforma de pagamentos Stripe.</SecText>
          <SecText>3.3. Os preços e os métodos de pagamento estão sujeitos a alterações a critério exclusivo da Base dos Dados. As alterações de preço ou de métodos de pagamento serão notificadas com antecedência.</SecText>
        </Box>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>4. Cancelamento e Reembolso</TitleText>
        <SecText>4.1. Você pode cancelar sua assinatura a qualquer momento através das opções disponíveis em sua conta. No entanto, não serão fornecidos reembolsos ou créditos por períodos em que a assinatura não foi utilizada.</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>5. Uso Responsável</TitleText>
        <SecText>5.1. Você concorda em usar nossos serviços de forma responsável e em conformidade com todas as leis e regulamentos aplicáveis.</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>6. Propriedade Intelectual</TitleText>
        <SecText>6.1. Todos os direitos de propriedade intelectual relacionados aos dados fornecidos são de propriedade de terceiros e estão sujeitos às suas respectivas políticas de uso.</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>7. Privacidade</TitleText>
        <SecText>7.1. O uso de seus dados pessoais é regido por nossa Política de Privacidade. Ao usar nossos serviços, você concorda com a coleta e o uso de suas informações conforme descrito em nossa Política de Privacidade.</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>8. Rescisão</TitleText>
        <SecText>8.1. Reservamo-nos o direito de encerrar ou suspender sua conta a qualquer momento, por qualquer motivo, sem aviso prévio.</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>9. Limitação de Responsabilidade</TitleText>
        <SecText>9.1. Em nenhuma circunstância seremos responsáveis por danos diretos, indiretos, especiais, incidentais ou consequentes decorrentes do uso ou da incapacidade de usar nossos serviços.</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>10. Alterações nos Termos de Serviço</TitleText>
        <SecText>10.1. Reservamo-nos o direito de modificar estes Termos de Serviço a qualquer momento. As alterações serão efetivas após a publicação das versões atualizadas em nosso site.</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>11. Lei Aplicável e Jurisdição</TitleText>
        <SecText>11.1. Estes Termos de Serviço serão regidos e interpretados de acordo com as leis do Brasil. Qualquer disputa relacionada a estes termos estará sujeita à jurisdição exclusiva dos tribunais do Rio de Janeiro, RJ, Brasil.</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>12. Contato</TitleText>
        <SecText>12.1. Para entrar em contato conosco com perguntas ou preocupações relacionadas a estes Termos de Serviço, por favor, envie um e-mail para suporte.bdpro@basedosdados.org.</SecText>
      </VStack> 

      <SecText>Ao utilizar nossos serviços, você concorda com todos os termos e condições estabelecidos neste acordo. Por favor, leia estes termos atentamente antes de prosseguir.</SecText>
    </VStack>
  )
}