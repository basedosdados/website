
import {
  VStack,
  Box
} from "@chakra-ui/react";
import BodyText from "../components/atoms/BodyText";
import SectionText from "../components/atoms/SectionText";

export default function ServiceTermsBDPro() {

  return (
    <VStack
      display="flex"
      flexDirection="column"
      spacing={0}
      alignItems="start"
      gap="24px"
    >
      <BodyText>Bem-vindo à BD Pro!</BodyText>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <BodyText>1. Aceitação dos Termos</BodyText>
        <SectionText>Ao acessar ou usar os serviços oferecidos pela Base dos dados ("Nós", "Nosso" ou "Nossos"), você concorda em cumprir e aceitar estes Termos de Serviço. Se você não concordar com todos os termos e condições deste acordo você não poderá usar nossos serviços.</SectionText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <BodyText>2. Descrição do Serviço</BodyText>
        <SectionText>2.1. Nossos serviços consistem em uma assinatura mensal que concede aos assinantes acesso a diversos dados exclusivos harmonizados e atualizados na plataforma da Base dos Dados. O acesso se dá via pacotes (Python, R e Stata) ou via BigQuery.</SectionText>
      </VStack>
    
      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <BodyText>3. Pagamento e Assinaturas</BodyText>
        <Box>
          <SectionText>3.1. Ao se inscrever em nosso serviço, você concorda em pagar a taxa mensal especificada. O pagamento será processado automaticamente a cada mês, a menos que você cancele sua assinatura antes da data de renovação.</SectionText>
          <SectionText>3.2. Os preços e os métodos de pagamento estão sujeitos a alterações a critério exclusivo da Base dos Dados. As alterações de preço ou de métodos de pagamento serão notificadas com antecedência.</SectionText>
        </Box>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <BodyText>4. Cancelamento e Reembolso</BodyText>
        <SectionText>4.1. Você pode cancelar sua assinatura a qualquer momento através das opções disponíveis em sua conta. No entanto, não serão fornecidos reembolsos ou créditos por períodos de assinatura não utilizados.</SectionText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <BodyText>5. Uso Responsável</BodyText>
        <SectionText>5.1. Você concorda em usar nossos serviços de forma responsável e em conformidade com todas as leis e regulamentos aplicáveis.</SectionText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <BodyText>6. Propriedade Intelectual</BodyText>
        <SectionText>6.1. Todos os direitos de propriedade intelectual relacionados aos dados fornecidos são de propriedade de terceiros e estão sujeitos às suas respectivas políticas de uso.</SectionText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <BodyText>7. Privacidade</BodyText>
        <SectionText>7.1. O uso de seus dados pessoais é regido por nossa Política de Privacidade. Ao usar nossos serviços, você concorda com a coleta e o uso de suas informações conforme descrito em nossa Política de Privacidade.</SectionText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <BodyText>8. Rescisão</BodyText>
        <SectionText>8.1. Reservamo-nos o direito de encerrar ou suspender sua conta a qualquer momento, por qualquer motivo, sem aviso prévio.</SectionText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <BodyText>9. Limitação de Responsabilidade</BodyText>
        <SectionText>9.1. Em nenhuma circunstância seremos responsáveis por danos diretos, indiretos, especiais, incidentais ou consequentes decorrentes do uso ou da incapacidade de usar nossos serviços.</SectionText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <BodyText>10. Alterações nos Termos de Serviço</BodyText>
        <SectionText>10.1. Reservamo-nos o direito de modificar estes Termos de Serviço a qualquer momento. As alterações serão efetivas após a publicação das versões atualizadas em nosso site.</SectionText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <BodyText>11. Lei Aplicável e Jurisdição</BodyText>
        <SectionText>11.1. Estes Termos de Serviço serão regidos e interpretados de acordo com as leis do Brasil. Qualquer disputa relacionada a estes termos estará sujeita à jurisdição exclusiva dos tribunais do Rio de Janeiro, RJ, Brasil.</SectionText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <BodyText>12. Contato</BodyText>
        <SectionText>12.1. Para entrar em contato conosco com perguntas ou preocupações relacionadas a estes Termos de Serviço, por favor, envie um e-mail para suporte.bdpro@basedosdados.org.</SectionText>
      </VStack> 

      <SectionText>Ao utilizar nossos serviços, você concorda com todos os termos e condições estabelecidos neste acordo. Por favor, leia estes termos atentamente antes de prosseguir.</SectionText>
    </VStack>
  )
}