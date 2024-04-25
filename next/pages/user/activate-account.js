import {
  Stack,
  VStack
} from "@chakra-ui/react";
import Display from "../../components/atoms/Display";
import RoundedButton from "../../components/atoms/RoundedButton";
import SectionText from "../../components/atoms/SectionText";
import { isMobileMod } from "../../hooks/useCheckMobile.hook";
import { MainPageTemplate } from "../../components/templates/main";

import { EmailConfirmImage, EmailRecoveryImage } from "../../public/img/emailImage";

export async function getServerSideProps(context) {
  const { query } = context

  const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_FRONTEND}/api/user/activeAccount?q=${query.q}&p=${query.p}`, { method: "GET" })
    .then(res => res.json())
  const data = result

  return {
    props: {
      data
    }
  }
}

export default function ActiveAccount({ data }) {
  return (
    <MainPageTemplate display="flex" justifyContent="center" cleanTemplate>
      <Stack
        display="flex"
        justifyContent="center"
        width="570px"
        height="100%"
        marginTop={isMobileMod() ? "150px" : "50px"}
        marginX="27px"
        spacing="40px"
        alignItems="center"
      >
        {data?.success === true ?
          <EmailConfirmImage justifyContent="center" marginBottom="8px"/>
        :
          <EmailRecoveryImage justifyContent="center" marginBottom="8px"/>
        }

        {data?.success === true ?
          <VStack spacing={4}>
            <Display
              fontSize={isMobileMod() ? "28px" : "34px"}
              lineHeight={isMobileMod() ? "36px" : "44px"}
              letterSpacing={isMobileMod() ? "0" : "-0.4px"}
              fontWeith="500"
              textAlign="center"
            >Conta ativa</Display>

            <SectionText>Parabéns! Sua conta foi ativada com sucesso. Agora você faz parte da nossa comunidade.</SectionText>
            <SectionText>Agradecemos por se juntar a nós. Estamos aqui para ajudar no que precisar.</SectionText>
            <SectionText>Bem-vindo(a)!</SectionText>

            <RoundedButton
              borderRadius="30px"
              onClick={() => window.open("/user/login", "_self")}
            >
              Logar na conta
            </RoundedButton>
          </VStack>
        :
          <VStack spacing={4}>
            <Display
              fontSize={isMobileMod() ? "28px" : "34px"}
              lineHeight={isMobileMod() ? "36px" : "44px"}
              letterSpacing={isMobileMod() ? "0" : "-0.4px"}
              fontWeith="500"
              textAlign="center"
            >Algo deu errado</Display>

            <SectionText textAlign="center">Lamentamos informar que ocorreu um problema durante a ativação da sua conta. Pedimos desculpas pela inconveniência.</SectionText>
            <RoundedButton
              borderRadius="30px"
              onClick={() => window.open("/contato", "_self")}
            >
              Entrar em contato
            </RoundedButton>
          </VStack>
        }
      </Stack>
    </MainPageTemplate>
  )
}