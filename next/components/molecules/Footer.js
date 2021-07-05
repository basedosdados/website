import {
  Box,
  HStack,
  Image,
  InputRightAddon,
  Stack,
  VStack,
  Text,
} from "@chakra-ui/react";
import ControlledInput from "../atoms/ControlledInput";
import Title from "../atoms/Title";
import SectionText from "../atoms/SectionText";
import Link from "../atoms/Link";
import { useState } from "react";
import BigTitle from "../atoms/BigTitle";

function LinkVStack({ title, children }) {
  return (
    <VStack spacing={5} alignItems="flex-start">
      <SectionText color="#FFFFFF">{title}</SectionText>
      {children}
    </VStack>
  );
}

function SocialLink({ title, href, src }) {
  return (
    <Link href={href} target="_blank">
      <HStack>
        <Image width="20px" src={src} />
        <Text>{title}</Text>
      </HStack>
    </Link>
  );
}

export default function Footer() {
  const [email, setEmail] = useState();

  return (
    <VStack width="100%" spacing={0}>
      <Stack
        alignItems="center"
        justifyContent="center"
        backgroundColor="#7EC876"
        width="100%"
        padding="50px 0px"
        spacing={10}
        direction={{ base: "column", lg: "row" }}
      >
        <VStack width={{ base: "90%", lg: "50%" }} spacing={10}>
          <BigTitle fontSize="26px" color="white">
            Já conhece a nossa newsletter mensal?
          </BigTitle>
          <ControlledInput
            value={email}
            onChange={setEmail}
            width="100%"
            inputBackgroundColor="white"
            inputStyle={{ borderRadius: 10 }}
            rightAddon={
              <Image width="20px" src="/_nxt/img/arrow_black_right.png" />
            }
          />
        </VStack>
        <Image width="150px" src="/_nxt/img/dadinho_mail.png" />
      </Stack>
      <VStack width="100%" padding={10} spacing={10} backgroundColor="#34A15A">
        <HStack
          alignItems="flex-start"
          width="100%"
          justifyContent="space-between"
        >
          <Image
            width={{ base: "100px", md: "180px" }}
            src="/_nxt/img/logo_footer.png"
          />
          <Stack
            direction={{ base: "column", lg: "row" }}
            paddingBottom="100px"
            justifyContent="space-around"
            width="70%"
            alignItems="flex-start"
            marginLeft="auto"
            spacing={{ base: 10, lg: 0 }}
          >
            <LinkVStack title="PRODUTOS">
              <Link href="/dataset">Mecanismo de busca</Link>
              <Link href="https://basedosdados.github.io/mais/" target="_blank">
                Datalake Público
              </Link>
            </LinkVStack>
            <LinkVStack title="CONTEÚDO">
              <Link>Blog</Link>
              <Link
                href="https://www.youtube.com/c/BasedosDados/videos"
                target="_blank"
              >
                Youtube
              </Link>
            </LinkVStack>
            <LinkVStack title="COMUNIDADE">
              <SocialLink
                href="https://twitter.com/basedosdados"
                title="Twitter"
                src="/_nxt/img/social/twitter.png"
              />
              <SocialLink
                href="https://discord.gg/huKWpsVYx4"
                title="Discord"
                src="/_nxt/img/social/discord.png"
              />
              <SocialLink
                href="https://github.com/basedosdados"
                title="Github"
                src="/_nxt/img/social/github.png"
              />
            </LinkVStack>
            <LinkVStack title="INSTITUCIONAL">
              <Link href="/about">Sobre</Link>
              <Link>Contato</Link>
            </LinkVStack>
          </Stack>
        </HStack>
        <VStack spacing={4}>
          <HStack
            fontFamily="Lato !important"
            color="white !important"
            letterSpacing="0.1em"
          >
            <Text>® 2021 Base dos Dados</Text>
            <Text>|</Text>
            <Link>Termos de uso</Link>
            <Text>|</Text>
            <Link>Política de privacidade</Link>
          </HStack>
          <Text
            color="white"
            fontSize="12px"
            fontFamily="Lato"
            fontWeight="500"
            letterSpacing="0.1em"
          >
            Ícones adaptados de Freepik, Smashicons, Pixel perfect, Vectors
            Market, Icongeek26, disponíveis em Flaticon
          </Text>
        </VStack>
      </VStack>
    </VStack>
  );
}
