import {
  Box,
  VStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { isMobileMod, useCheckMobile } from "../hooks/useCheckMobile.hook";
import Display from "../components/atoms/Display";
import BodyText from "../components/atoms/BodyText";
import SText from "../components/atoms/SectionText";
import { SimpleTable } from "../components/atoms/SimpleTable";
import { MainPageTemplate } from "../components/templates/main";
import ServiceTerms from "../content/serviceTerms";
import PrivacyPolicy from "../content/privacyPolicy";

export default function TermsAndPolitics() {
  const router = useRouter()
  const { query } = router
  const [sectionSelected, setSectionSelected] = useState("")

  function movedScroll(value) {
    window.scrollTo({
      top: value,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const id = query?.section
    let targetElement = ""

    if(id === "terms") {
      targetElement = document.getElementById("Termos de Serviço BD Pro")
      setSectionSelected("Termos de Serviço BD Pro")
      movedScroll(useCheckMobile() ? 210 : 80)
    }
    if(id === "privacy") {
      targetElement = document.getElementById("Políticas de Privacidade")
      setSectionSelected("Políticas de Privacidade")
      movedScroll(targetElement?.offsetTop+120)
    }
    if(id === "cookies") {
      targetElement = document.getElementById("Cookies")
      setSectionSelected("Cookies")
      movedScroll(targetElement.offsetTop+120)
    }
  },[query?.section])

  const SectionText = ({ section }) => {
    function handlerClick(elm) {
      if(elm === sectionSelected) {
        setSectionSelected("")
        window.scrollTo({top: 1})
      } else {
        setSectionSelected(elm)
        const targetElement = document.getElementById(elm)

        if (targetElement) {
          if(targetElement.id === "Termos de Serviço BD Pro") {
            movedScroll(useCheckMobile() ? 210 : 80)
          } else {
            movedScroll(targetElement?.offsetTop+120)
          }
        }
        router.push({
          pathname: router.pathname,
          query: { section: targetElement.getAttribute("name")}
        })
      }
    }

    
    return (
      <Text
        fontSize="16px"
        color={sectionSelected === section ? "#2B8C4D" :"#6F6F6F"}
        fontFamily="ubuntu"
        fontWeight="500"
        width="max-content"
        cursor="pointer"
        letterSpacing="0.2px"
        onClick={() => handlerClick(section)}
      >
        {section}
      </Text>
    )
  }

  return (
    <MainPageTemplate paddingX="24px">
      <Head>
        <title>Termos e Privacidade – Base dos Dados</title>
        <meta
          property="og:title"
          content="Termos e Privacidade – Base dos Dados"
          key="ogtitle"
        />
        {/* <meta
          property="og:description"
          content=""
          key="ogdesc"
        /> */}
      </Head>

      <VStack
        width="100%"
        maxWidth="1264px"
        margin="auto"
        paddingTop={isMobileMod() && "80px"}
        spacing={0}
      >
        <Display
          paddingBottom={isMobileMod() ? "56px" : "66px" }
          color="#2B8C4D"
        >
          Termos e Privacidade
        </Display>

        <Stack
          width="100%"
          position="relative"
          gridGap={isMobileMod() ? "64px" : "120px"}
          spacing={0}
          flexDirection={isMobileMod() ? "column" :"row"} 
          paddingBottom="32px"
        >
          <Box
            display="flex"
            height="100%"
            flexDirection="column"
            gridGap="16px"
            position={isMobileMod() ? "relative" : "sticky"}
            top={isMobileMod()? "0" : "120px"}
          >
            <SectionText section="Termos de Serviço BD Pro"/>
            <SectionText section="Políticas de Privacidade"/>
            <SectionText section="Cookies"/>
          </Box>

          <Stack
            width="100%"
            spacing="80px"
          >
            <VStack
              id="Termos de Serviço BD Pro"
              name="terms"
              width="100%"
              spacing={8}
              alignItems="flex-start"
            >
              <Text
                fontFamily="Ubuntu"
                fontSize="24px"
                lineHeight="40px"
                fontWeight="400"
                color="#252A32"
              >Termos de Serviço BD Pro</Text>
              <ServiceTerms/>
            </VStack>

            <VStack
              id="Políticas de Privacidade"
              name="privacy"
              width="100%"
              spacing={8}
              alignItems="flex-start"
            >
              <Text
                fontFamily="Ubuntu"
                fontSize="24px"
                lineHeight="40px"
                fontWeight="400"
                color="#252A32"
              >Políticas de Privacidade</Text>
              <PrivacyPolicy/>
            </VStack>

            <VStack
              id="Cookies"
              name="cookies"
              width="100%"
              spacing={8}
              alignItems="flex-start"
            >
              <Text
                fontFamily="Ubuntu"
                fontSize="24px"
                lineHeight="40px"
                fontWeight="400"
                color="#252A32"
              >Cookies</Text>
              <VStack
                width="100%"
                spacing={4}
                alignItems="flex-start"
              >
                <SText fontSize="16px">Olá! Queremos informar que este site utiliza cookies. Esses pequenos arquivos são necessários para garantir o funcionamento adequado do site, melhorar o desempenho e personalizar a experiência de navegação.</SText>

                <BodyText fontWeight="500">O que são Cookies?</BodyText>
                <SText>Cookies são pedaços de dados que ajudam o site a lembrar suas preferências e tornar a navegação mais eficiente.</SText>

                <BodyText fontWeight="500">Como Usamos Cookies?</BodyText>
                <SText><b>Desempenho:</b> Garantimos que o site funcione como deveria.</SText>
                <SText><b>Melhoria:</b> Coletamos dados para melhorar continuamente nosso conteúdo e funcionalidades.</SText>
                <SText><b>Personalização:</b> Adaptamos o conteúdo para suas preferências, como idioma e região.</SText>

                <BodyText fontWeight="500">Cookies usados:</BodyText>

                <Stack
                  maxWidth="100%"
                >
                  <SimpleTable
                    valuesTable={{
                      "whiteSpace": "break-spaces"
                    }}
                    headers={["Nome do Cookie", "Retenção", "Finalidade"]}
                    values={[[
                      "cookieAccepted", "1 ano", "Este cookie é usado para armazenar a decisão de aceite de cookies dos nossos serviços. É utilizado para ocultar o popup de confirmação ou notificar o usuário quando os termos de uso forem alterados no futuro. Sem ele, você não conseguirá fazer login."
                    ],[
                      "userBD", "7 dias", "Quando você faz login em nosso site, esse cookie especial é criado para armazenar suas informações básicas. Esse cookie é essencial para permitir que você permaneça logado e acesse as áreas protegidas do site. Sem ele, você não conseguirá fazer login."
                    ],[
                      "token", "7 dias", "Ao realizar o login em nosso site, esse cookie especial é criado para armazenar seu token de acesso. Este token não apenas permite que você permaneça logado, mas também atua como um guardião para garantir a integridade de suas configurações e informações pessoais."
                    ]]}
                  />
                </Stack>

                <BodyText fontWeight="500">Controle de Privacidade:</BodyText>
                <SText>Ao continuar a usar nosso site, você concorda com o uso desse cookie. Se preferir não usá-lo, recomendamos que ajuste as configurações do seu navegador. No entanto, isso afetará sua capacidade de fazer login e acessar áreas restritas.</SText>
                <SText>Estamos aqui para ajudar. Se tiver alguma dúvida sobre esse cookie ou qualquer outra questão de privacidade, entre em contato conosco.</SText>
              </VStack>
            </VStack>
          </Stack>
        </Stack>
      </VStack>
    </MainPageTemplate>
  )
}