import {
    Box,
    VStack,
    Stack,
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";
import Display from "../components/atoms/Display";
import Subtitle from "../components/atoms/Subtitle";
import BodyText from "../components/atoms/BodyText";
import Link from "../components/atoms/Link";
import { MainPageTemplate } from "../components/templates/main";
import { withPages } from "../hooks/pages.hook";
    
export async function getStaticProps(context) {
  return await withPages();
}

export default function Contato({ pages }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src='https://js.hsforms.net/forms/v2.js';
    document.body.appendChild(script);

    script.addEventListener('load', () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          region: "na1",
          portalId: "9331013",
          formId: "3c85cc81-2b91-4a90-b3ff-41412dfed25e",
          target: '#form-hbspt'
        })
      }
    })
  },[])
    
  return (
    <MainPageTemplate pages={pages} paddingX="24px">
      <Head>
        <title>Contato – Base dos Dados</title>
        <meta
          property="og:title"
          content="Contato – Base dos Dados"
          key="ogtitle"
        />
        <meta
          property="og:description"
          content="Entre em contato com nossa equipe."
          key="ogdesc"
        />
      </Head>

      <Stack
        gridGap={{base:"40px", lg: "100px"}}
        paddingTop={{ base: "80px", lg: "0px" }}
        width="100%"
        maxWidth="1264px"
        justify="space-between"
        direction={{ base: "column", lg: "row" }}
        margin="auto"
      >
        <VStack maxWidth={{ base: "100%", lg: "45%" }}>
          <Box contentAlign="flex-start">
            <Display
              fontSize="34px"
              lineHeight="40px"
              letterSpacing="-0.6px" 
              color="#2B8C4D"
              paddingBottom="16px"
            >
              Entre em contato
            </Display>
            <BodyText fontSize="16px" letterSpacing="0.2px" paddingBottom="32px">
              Envie sua mensagem no formulário ao lado para falar com nossa equipe.
            </BodyText>
            <Subtitle fontSize="18px" letterSpacing="0.1px" paddingBottom="8px">
              Apoio institucional
            </Subtitle>
            <BodyText fontSize="16px" letterSpacing="0.2px" paddingBottom="32px">
              A Base dos Dados é mantida por meio doações de pessoas que acreditam na transparência e acesso a dados de qualidade. Colabore para o crescimento e fortalecimento da iniciativa.
            </BodyText>
            <Subtitle fontSize="18px" letterSpacing="0.1px" paddingBottom="8px">
              Serviços
            </Subtitle>
            <BodyText fontSize="16px" letterSpacing="0.2px" paddingBottom="32px">
              Fale diretamente com nossa equipe comercial para marcarmos uma conversa e avaliarmos como{" "}
              <Link
                href="/servicos"
                textDecoration="none"
                fontFamily="Ubuntu"
                color="#42B0FF"
                fontSize="16px"
                letterSpacing="0.3px"
              >
                nossos serviços
              </Link> podem ajudar.
            </BodyText>
            <Subtitle fontSize="18px" letterSpacing="0.1px" paddingBottom="8px">
              Projetos e Parcerias
            </Subtitle>
            <BodyText fontSize="16px" letterSpacing="0.2px" paddingBottom="32px">
              Desenvolvemos projetos e aplicações com outras organizações afins para promover o acesso a dados públicos de qualidade. Estamos sempre abertos a novas ideias.
            </BodyText>
            <Subtitle fontSize="18px" letterSpacing="0.1px" paddingBottom="8px">
              Dados
            </Subtitle>
            <BodyText fontSize="16px" letterSpacing="0.2px" paddingBottom="16px">
              Auxiliamos pessoas e organizações a subirem dados no nosso <i>datalake</i>. Escreva sua proposta para nossa equipe de Dados.
            </BodyText>
            <BodyText fontSize="16px" letterSpacing="0.2px" fontWeigth="500">
              Dúvidas? Fale com a nossa comunidade no{" "}
              <Link
                href="https://discord.gg/huKWpsVYx4"
                textDecoration="none"
                fontFamily="Ubuntu"
                color="#42B0FF"
                target="_blank"
                fontSize="16px"
                letterSpacing="0.3px"
              >
                Discord<a style={{color:"#252A32", fontWeight:"500"}}>.</a>
              </Link>
            </BodyText>
          </Box>
        </VStack>
        <Stack paddingTop="20px" >
          <Box 
            width="100%"
            minWidth={{base:"100%", lg: "500px"}} 
            maxWidth="500px"
            height="100%" 
            maxHeight="600px" 
            id="form-hbspt"
          />
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}
