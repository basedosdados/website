import {
  HStack,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Link from "../atoms/Link";
import BodyText from "../atoms/BodyText"
import { useCheckMobile } from "../../hooks/useCheckMobile.hook"
import { useTranslation } from 'next-i18next';

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
  const { t } = useTranslation('header_footer');
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
            <SectionCategories title={t("PRODUCTS")} marginBottom={isMobileMod && "24px !important"}>
              <FooterLink target="_self" href="/dataset">
                {t("Search Engine")}
              </FooterLink>
              <FooterLink href="https://basedosdados.github.io/mais/">
                {t("Public Datalake")}
              </FooterLink>
              <FooterLink href="https://basedosdados.github.io/mais/access_data_packages/">
                {t("Packages")}
              </FooterLink>
              <FooterLink href="https://info.basedosdados.org/bd-pro">
                {t("BD Pro")}
              </FooterLink>
              <FooterLink href="https://info.basedosdados.org/bd-edu-sql">
                {t("BD Edu")}
              </FooterLink>
            </SectionCategories>

            <SectionCategories title={t("SERVICES")} marginBottom={isMobileMod && "24px !important"}>
              <FooterLink target="_self" href="/servicos#Captura de dados">
                {t("Data Capture")}
              </FooterLink>
              <FooterLink href="/servicos#Análise de dados">
                {t("Data Analysis")}
              </FooterLink>
              <FooterLink href="/servicos#Consultoria de dados">
                {t("Data Consulting")}
              </FooterLink>
              <FooterLink href="/servicos#Estudos de caso">
                {t("Case Studies")}
              </FooterLink>
            </SectionCategories>

            <SectionCategories title={t("TUTORIALS")} marginBottom={isMobileMod && "24px !important"}>
              <FooterLink href="https://basedosdados.github.io/mais/">
                {t("Documentation")}
              </FooterLink>
              <FooterLink href="https://www.youtube.com/watch?v=nGM2OwTUY_M&list=PLu5pyM8QY6hg3GpNCyCtSS3sUi4Jo8Pir">
                {t("YouTube Videos")}
              </FooterLink>
            </SectionCategories>

            <SectionCategories title={t("INSTITUTIONAL")} marginBottom={isMobileMod && "24px !important"}>
              <FooterLink target="_self" href="/quem-somos">
                {t("Who We Are")}
              </FooterLink>
              <FooterLink target="_self" href="/transparencia">
                {t("Transparency")}
              </FooterLink>
              <FooterLink href="https://info.basedosdados.org/newsletter">
                {t("Newsletter")}
              </FooterLink>
              <FooterLink href="https://info.basedosdados.org/carreiras">
                {t("Careers")}
              </FooterLink>
              <FooterLink href="/perguntas-frequentes">
                {t("FAQ")}
              </FooterLink>
              <FooterLink target="_self" href="/termos-e-privacidade">
                {t("Terms and Privacy")}
              </FooterLink>
              <FooterLink target="_self" href="/contato">
                {t("Contact")}
              </FooterLink>
              <Link fontWeight="700" color="white" href="/#support">
                {t("Support the Project")}
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
            <BodyText color="#FFF" fontSize="16px" letterSpacing="0.2px">® 2024 {t("Base dos Dados")}</BodyText>
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
