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
    <Link color="white" href={href} target="_blank">
      <HStack>
        <Box position="relative" height="20px" width="20px">
          <Image priority layout="fill" objectFit="contain" src={src} />
        </Box>
        <Text>{title}</Text>
      </HStack>
    </Link>
  );
}

export default function Footer() {
  const [email, setEmail] = useState();

  return (
    <VStack width="100%" spacing={0}>
      <VStack width="100%" padding={10} spacing={10} backgroundColor="#34A15A">
        <Stack
          alignItems="flex-start"
          width={{ base: "100%", lg: "80%" }}
          justifyContent="space-between"
          direction={{ base: "column", lg: "row" }}
          spacing={{ base: 10, lg: 20 }}
        >
          <Box minWidth="250px" height="250px" position="relative">
            <Image
              priority
              objectFit="contain"
              layout="fill"
              src="/_nxt/img/logo_footer.png"
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
              <Link color="white" href="/dataset">
                Mecanismo de busca
              </Link>
              <Link
                color="white"
                href="https://basedosdados.github.io/mais/"
                target="_blank"
              >
                Datalake Público
              </Link>
            </LinkVStack>
            <LinkVStack title="CONTEÚDO">
              <Link color="white">Blog</Link>
              <Link
                color="white"
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
              <Link color="white" href="/about">
                Sobre
              </Link>
              <Link color="white">Contato</Link>
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
            <Text>|</Text>
            <Link color="white">Termos de uso</Link>
            <Text>|</Text>
            <Link color="white">Política de privacidade</Link>
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
