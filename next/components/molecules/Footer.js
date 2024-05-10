import {
  HStack,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Link from "../atoms/Link";
import BodyText from "../atoms/BodyText"
import { useCheckMobile } from "../../hooks/useCheckMobile.hook"

import YoutubeIcon from "../../public/img/icons/youtubeIcon";
import TwitterIcon from "../../public/img/icons/twitterIcon";
import DiscordIcon from "../../public/img/icons/discordIcon";
import GithubIcon from "../../public/img/icons/githubIcon";
import LinkedinIcon from "../../public/img/icons/linkedinIcon";
import WhatsAppIcon from "../../public/img/icons/whatsAppIcon";
import TelegramIcon from "../../public/img/icons/telegramIcon";

function SectionCategories({ title, children, ...props }) {
  return (
    <VStack spacing={0} alignItems="flex-start" {...props}>
      <BodyText 
        color="#FFF"
        fontSize="14px"
        fontWeight="300"
        letterSpacing="0.5px"
        marginBottom="16px"
      >
        {title}
      </BodyText>
      <Stack spacing="10px">
        {children}
      </Stack>
    </VStack>
  );
}

const IconKey = {
  width: "24px",
  height: "24px",
  fill: "#FFF"
}

function SocialLink({ href, icon }) {
  return (
    <Link href={href} target="_blank">
      {icon}
    </Link>
  )
}

function FooterLink(props) {
  return (
    <Link
      fontFamily="ubuntu"
      fontWeight="400"
      letterSpacing="0.3px"
      color="#FFF"
      target="_blank"
      {...props}
    />
  )
}

export default function Footer({ ocult = false }) {
  const mobileCheck = useCheckMobile()
  const [isMobileMod, setIsMobileMod] = useState(false)
  
  useEffect(() => {
    setIsMobileMod(mobileCheck)
  },[])

  if(ocult === true) return null

  return (
    <VStack
      position="relative"
      zIndex="10"
      width="100%"
      spacing={0}
    >
      <VStack 
        width="100%"
        backgroundColor="#34A15A"
        padding="80px 24px 40px"
        spacing={10}
      >
        <Stack
          alignItems="flex-start"
          width="100%"
          maxWidth="1264px"
          justifyContent="space-between"
          direction={{ base: "column", lg: "row" }}
          spacing={0}
          gridGap="24px"
        >
          <BodyText
            minWidth="240px"
            fontWeight="400"
            fontSize="34px"
            letterSpacing="-0.4px"
            color="#FFF"
            paddingBottom="40px"
          >Base dos Dados</BodyText>

          <Stack
            paddingBottom="40px"
            display={isMobileMod ? "grid" : "flex"}
            direction={"row"}
            gridTemplateColumns={isMobileMod && "1fr 1fr"}
            gridGap={isMobileMod && "30px"}
            width="100%"
            alignItems="flex-start"
            justifyContent="flex-end"
            spacing={isMobileMod ? "0" :"80px"}
            marginLeft="auto"
          >
            <SectionCategories title="PRODUTOS" marginBottom={isMobileMod && "24px !important"}>
              <FooterLink target="_self" href="/dataset">
                Mecanismo de busca
              </FooterLink>
              <FooterLink href="https://basedosdados.github.io/mais/">
                Datalake público
              </FooterLink>
              <FooterLink href="https://basedosdados.github.io/mais/access_data_packages/">
                Pacotes
              </FooterLink>
              <FooterLink href="https://info.basedosdados.org/bd-pro">
                BD Pro
              </FooterLink>
              <FooterLink href="https://info.basedosdados.org/bd-edu-python">
                BD Edu
              </FooterLink>
            </SectionCategories>

            <SectionCategories title="SERVIÇOS" marginBottom={isMobileMod && "24px !important"}>
              <FooterLink target="_self" href="/servicos#Captura de dados">
                Captura de dados
              </FooterLink>
              <FooterLink href="/servicos#Análise de dados">
                Análise de dados
              </FooterLink>
              <FooterLink href="/servicos#Consultoria de dados">
                Consultoria de dados
              </FooterLink>
              <FooterLink href="/estudos-de-caso">
                Estudos de caso
              </FooterLink>
            </SectionCategories>

            <SectionCategories title="TUTORIAIS" marginBottom={isMobileMod && "24px !important"}>
              <FooterLink href="https://basedosdados.github.io/mais/">
                Documentação
              </FooterLink>
              <FooterLink href="https://www.youtube.com/watch?v=nGM2OwTUY_M&list=PLu5pyM8QY6hg3GpNCyCtSS3sUi4Jo8Pir">
                Vídeos no YouTube
              </FooterLink>
            </SectionCategories>

            <SectionCategories title="INSTITUCIONAL" marginBottom={isMobileMod && "24px !important"}>
              <FooterLink target="_self" href="/quem-somos">
                Quem somos
              </FooterLink>
              <FooterLink target="_self" href="/transparencia">
                Transparência
              </FooterLink>
              <FooterLink href="https://info.basedosdados.org/newsletter">
                Newsletter
              </FooterLink>
              <FooterLink href="https://info.basedosdados.org/carreiras">
                Carreiras
              </FooterLink>
              <FooterLink href="/perguntas-frequentes">
                Perguntas frequentes
              </FooterLink>
              <FooterLink target="_self" href="/termos-e-privacidade">
                Termos e Privacidade
              </FooterLink>
              <FooterLink target="_self" href="/contato">
                Contato
              </FooterLink>
              <Link fontWeight="700" color="white" href="/#support">
                Apoie o projeto
              </Link>
            </SectionCategories>
          </Stack>
        </Stack>
      </VStack>

      <HStack
        width="100%"
        height={isMobileMod ? "100%" :"76px"}
        backgroundColor="#2B8C4D"
        padding="30px"
      >
        <HStack
          width="100%"
          maxWidth="1264px"
          margin="0 auto"
          justifyContent="space-between"
          flexDirection={isMobileMod && "column-reverse"}
          alignItems="flex-start"
          spacing={0}
        >
          <HStack
            spacing={isMobileMod ? 0 : 4}
            textAlign="center"
            maxWidth="1264px"
            flexDirection={isMobileMod && "column"}
            alignItems="flex-start"
            marginTop={isMobileMod && "16px"}
          >
            <BodyText color="#FFF" fontSize="16px" letterSpacing="0.2px">® 2024 Base dos Dados</BodyText>
          </HStack>

          <HStack spacing={3}>
            <SocialLink title="Twitter" href="https://twitter.com/basedosdados" icon={<TwitterIcon alt="twitter da BD" {...IconKey}/>}/>
            <SocialLink title="Discord" href="https://discord.gg/huKWpsVYx4" icon={<DiscordIcon alt="discord da BD" {...IconKey}/>}/>
            <SocialLink title="GitHub" href="https://github.com/basedosdados" icon={<GithubIcon alt="github da BD" {...IconKey}/>}/>
            <SocialLink title="LinkedIn" href="https://www.linkedin.com/company/base-dos-dados/mycompany/" icon={<LinkedinIcon alt="linkedin da BD" {...IconKey}/>}/>
            <SocialLink title="YouTube" href="https://www.youtube.com/basedosdados" icon={<YoutubeIcon alt="youtube basedosdados" {...IconKey}/>}/>
            <SocialLink title="WhatsApp" href="https://chat.whatsapp.com/CLLFXb1ogPPDomCM6tQT22" icon={<WhatsAppIcon alt="whatsApp da BD"{...IconKey}/>}/>
            <SocialLink title="Telegram" href="https://t.me/joinchat/OKWc3RnClXnq2hq-8o0h_w" icon={<TelegramIcon alt="telegram da BD" {...IconKey}/>}/>
          </HStack>
        </HStack>
      </HStack>
    </VStack>
  );
}
