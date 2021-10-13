import {
  Box,
  HStack,
  InputRightAddon,
  Stack,
  VStack,
  Text,
  Button,
} from "@chakra-ui/react";
import Image from "next/image";
import ControlledInput from "../atoms/ControlledInput";
import Title from "../atoms/Title";
import SectionText from "../atoms/SectionText";
import Link from "../atoms/Link";
import { useState } from "react";
import BigTitle from "../atoms/BigTitle";
import RoundedButton from "../atoms/RoundedButton";

function LinkVStack({ title, children }) {
  return (
    <VStack spacing={5} alignItems="flex-start">
      <SectionText color="#FFFFFF" fontFamily="Lato" fontWeight="500">
        {title}
      </SectionText>
      {children}
    </VStack>
  );
}

function SocialLink({ title, href, src }) {
  return (
    <Link fontWeigth="500" color="white" href={href} target="_blank">
      <HStack>
        <Box position="relative" height="20px" width="20px">
          <Image priority layout="fill" objectFit="contain" src={src} />
        </Box>
        <Text>{title}</Text>
      </HStack>
    </Link>
  );
}

function FooterLink(props) {
  return <Link fontWeigth="500" {...props} />;
}

export default function Footer({ strapiPages }) {
  const [email, setEmail] = useState();

  // const contactPage = strapiPages.filter((p) => p.Title === "Contato");
  // const aboutPage = strapiPages.filter((p) => p.Title === "Sobre");

  return (
    <VStack position="relative" zIndex="10" width="100%" spacing={0}>
      <VStack width="100%" padding={10} spacing={10} backgroundColor="#34A15A">
        <Stack
          alignItems="flex-start"
          width={{ base: "100%", lg: "92%" }}
          justifyContent="space-between"
          direction={{ base: "column", lg: "row" }}
          spacing={{ base: 10, lg: 20 }}
        >
          <Box minWidth="250px" height="250px" position="relative">
            <Image
              priority
              objectFit="contain"
              layout="fill"
              src="/img/logo_footer.png"
            />
          </Box>
          <Stack
            direction={{ base: "column", lg: "row" }}
            paddingBottom="100px"
            justifyContent="space-around"
            width="100%"
            alignItems="flex-start"
            marginLeft="auto"
            spacing={{ base: 10, lg: 0 }}
          >
            <LinkVStack title="PRODUTOS">
              <FooterLink color="white" href="/dataset">
                Mecanismo de busca
              </FooterLink>
              <FooterLink
                color="white"
                href="https://basedosdados.github.io/mais/" // TODO: ir para "Dados" com filtro BD+
                target="_blank"
              >
                Datalake público
              </FooterLink>
              <FooterLink
                color="white"
                href="https://basedosdados.github.io/mais/access_data_packages/"
                target="_blank"
              >
                Pacotes
              </FooterLink>
            </LinkVStack>
            <LinkVStack title="CONTEÚDO">
              <FooterLink
                href="https://basedosdados.hubspotpagebuilder.com/assine-a-newsletter-da-base-dos-dados"
                color="white"
                target="_blank"
              >
                Assine a newsletter
              </FooterLink>
              <FooterLink
                href="https://medium.com/basedosdados"
                color="white"
                target="_blank"
              >
                Blog
              </FooterLink>
              <SocialLink
                color="white"
                href="https://www.youtube.com/c/BasedosDados/featured"
                target="_blank"
                title="Youtube"
                src="/img/logos/youtube.png"
              />
            </LinkVStack>
            <LinkVStack title="COMUNIDADE">
              <SocialLink
                href="https://twitter.com/basedosdados"
                title="Twitter"
                src="/img/social/twitter.png"
              />
              <SocialLink
                href="https://discord.gg/huKWpsVYx4"
                title="Discord"
                src="/img/social/discord.png"
              />
              <SocialLink
                href="https://github.com/basedosdados"
                title="GitHub"
                src="/img/social/github.png"
              />
              <SocialLink
                href="https://www.linkedin.com/company/base-dos-dados/mycompany/"
                title="LinkedIn"
                src="/img/logos/linkedin.png"
              />
              <SocialLink
                href="https://chat.whatsapp.com/HXWgdFc1RmwCoblly5KPBZ"
                title="WhatsApp"
                src="/img/logos/whatsapp.png"
              />
              <SocialLink
                href="https://t.me/joinchat/OKWc3RnClXnq2hq-8o0h_w"
                title="Telegram"
                src="/img/logos/telegram.png"
              />
            </LinkVStack>
            <LinkVStack title="INSTITUCIONAL">
              <FooterLink
                href="https://basedosdados.org/blog/2/" // TODO: Mudar o ID para quem-somos
                color="white"
              >
                Quem Somos
              </FooterLink>
              <FooterLink
                color="white"
                href="https://basedosdados.org/blog/1/" // TODO: Mudar o ID para fale-conosco
              >
                Fale Conosco
              </FooterLink>
              <FooterLink color="white" href="/servicos">
                Serviços
              </FooterLink>
              <Link fontWeigth="700" color="white" href="/#support">
                Apoie o projeto
              </Link>
            </LinkVStack>
          </Stack>
        </Stack>
        <VStack spacing={4}>
          <HStack
            fontFamily="Lato !important"
            color="white !important"
            letterSpacing="0.1em"
          >
            <Text>® 2021 Base dos Dados</Text>
            {/* <Text>|</Text> // TODO: Não existem essas páginas ainda!
            <Link color="white">Termos de uso</Link>
            <Text>|</Text>
            <Link color="white">Política de privacidade</Link> */}
          </HStack>
          <Text
            color="white"
            fontSize="12px"
            fontFamily="Lato"
            fontWeight="500"
            letterSpacing="0.1em"
          >
            Ícones adaptados de Freepik e Smashicons disponíveis em Storyset e
            Flaticon.
          </Text>
        </VStack>
      </VStack>
    </VStack>
  );
}
