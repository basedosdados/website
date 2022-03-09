import {
    Box,
    VStack,
    Stack,
  } from "@chakra-ui/react";
import { useEffect } from "react"
import { LinkDash } from "../components/atoms/LinkDash";
import BigTitle from "../components/atoms/BigTitle";
import Title from "../components/atoms/Title";
import SectionText from "../components/atoms/SectionText";
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
        // @TS-ignore
        if (window.hbspt) {
            // @TS-ignore
            window.hbspt.forms.create({
                region: "na1",
                portalId: "9331013",
                formId: "3c85cc81-2b91-4a90-b3ff-41412dfed25e",
                target: '#contato'
            })
        }
    });
   },[]);
    
  return (
    <MainPageTemplate pages={pages}>
      <Stack
      paddingTop={{ base: "80px", lg: "0px" }}
      width="80%"
      justify="space-between"
      direction={{ base: "column", lg: "row" }}
      margin="auto"
      >
        <VStack maxWidth={{ base: "100%", lg: "45%" }}>
          <Box contentAlign="flex-start">
            <BigTitle paddingBottom="20px">
              Entre em contato
            </BigTitle>
            <SectionText fontSize="14px" fontWeight="300" paddingBottom="25px" color="#6F6F6F">
              Envie sua mensagem no formulário ao lado para falar com nossa equipe.
            </SectionText>
            <Title fontSize="18px" fontWeight="400" paddingBottom="5px" color="#252A43">
              Apoio institucional
            </Title>
            <SectionText fontSize="14px" fontWeight="300" paddingBottom="25px" color="#6F6F6F">
              A Base dos Dados é mantida por meio doações de pessoas que acreditam na transparência e acesso a dados de qualidade. Colabore para o crescimento e fortalecimento da iniciativa.
            </SectionText>
            <Title fontSize="18px" fontWeight="400" paddingBottom="5px" color="#252A43">
              Serviços
            </Title>
            <SectionText fontSize="14px" fontWeight="300" paddingBottom="25px" color="#6F6F6F">
              Fale diretamente com nossa equipe comercial para marcarmos uma conversa e avaliarmos como{" "}
              <LinkDash
              href="/servicos"
              dash={false}
              fontSize="14px"
              fontWeight="bold"
              textDecoration="none"
              >
                nossos serviços{" "}
              </LinkDash>
              podem ajudar.
            </SectionText>
            <Title fontSize="18px" fontWeight="400" paddingBottom="5px" color="#252A43">
              Projetos e Parcerias
            </Title>
            <SectionText fontSize="14px" fontWeight="300" paddingBottom="25px" color="#6F6F6F">
              Desenvolvemos projetos e aplicações com outras organizações afins para promover o acesso a dados públicos de qualidade. Estamos sempre abertos a novas ideias.
            </SectionText>
            <Title fontSize="18px" fontWeight="400" paddingBottom="5px" color="#252A43">
              Dados
            </Title>
            <SectionText fontSize="14px" fontWeight="300" paddingBottom="25px" color="#6F6F6F">
              Auxiliamos pessoas e organizações a subirem dados no nosso <i>datalake</i>. Escreva sua proposta para nossa equipe de Dados.
            </SectionText>
            <SectionText fontSize="14px" fontWeight="300" color="#6F6F6F">
              Dúvidas? Fale com a nossa comunidade no{" "}
              <LinkDash
              href="https://discord.gg/huKWpsVYx4"
              dash={false}
              fontSize="14px"
              fontWeight="bold"
              textDecoration="none"
              >
                Discord.
              </LinkDash>
            </SectionText>
          </Box>
        </VStack>
        <Box>
            <Box width="100%" height="100%" id="contato"/>
        </Box>
      </Stack>
    </MainPageTemplate>
  )
}
