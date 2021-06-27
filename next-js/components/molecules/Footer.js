import {
  Box,
  HStack,
  Image,
  InputRightAddon,
  Stack,
  VStack,
} from "@chakra-ui/react";
import ControlledInput from "../atoms/ControlledInput";
import Title from "../atoms/Title";
import SectionText from "../atoms/SectionText";
import Link from "../atoms/Link";
import { useState } from "react";
import BigTitle from "../atoms/BigTitle";

function LinkVStack({ title, children }) {
  return (
    <VStack alignItems="flex-start">
      <SectionText color="#FFFFFF">{title}</SectionText>
      {children}
    </VStack>
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
              <Image
                width="20px"
                src="/new-next-site/next-img/arrow_black_right.png"
              />
            }
          />
        </VStack>
        <Image width="150px" src="/new-next-site/next-img/dadinho_mail.png" />
      </Stack>
      <HStack
        justifyContent="space-between"
        alignItems="flex-start"
        width="100%"
        padding={10}
        spacing={10}
        backgroundColor="#34A15A"
      >
        <Image
          width={{ base: "100px", md: "180px" }}
          src="/new-next-site/next-img/logo_footer.png"
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
            <Link href="https://twitter.com/basedosdados" target="_blank">
              Twitter
            </Link>
            <Link href="https://discord.gg/huKWpsVYx4" target="_blank">
              Discord
            </Link>
            <Link href="https://github.com/basedosdados" target="_blank">
              Github
            </Link>
          </LinkVStack>
          <LinkVStack title="INSTITUCIONAL">
            <Link href="/about">Sobre</Link>
            <Link>Termos de uso</Link>
            <Link>Política de privacidade</Link>
          </LinkVStack>
        </Stack>
      </HStack>
    </VStack>
  );
}
