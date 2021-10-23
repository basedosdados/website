import { Image } from "@chakra-ui/image";
import { HStack, Stack, VStack } from "@chakra-ui/layout";
import BigTitle from "../atoms/BigTitle";
import Link from "../atoms/Link";
import RoundedButton from "../atoms/RoundedButton";
import SectionText from "../atoms/SectionText";
import SectionTitle from "../atoms/SectionTitle";
import { ShadowBox } from "../atoms/ShadowBox";
import { NamedAvatar } from "../molecules/NamedAvatar";

function PartnerBox({ src, ...props }) {
  return (
    <ShadowBox
      align="center"
      justify="center"
      width="120px"
      height="120px"
      padding="0px"
      paddingBottom="20px"
      {...props}
    >
      <Image width="100%" height="100%" objectFit="contain" src={src} />
    </ShadowBox>
  );
}

export function BePartner() {
  return (
    <VStack width="80%" spacing={7} margin="auto">
      <BigTitle>Como impactamos pessoas e organizações</BigTitle>
      <Stack
        width="100%"
        justifyContent="space-between"
        pt="50px"
        direction={{ base: "column", lg: "row" }}
      >
        <VStack alignItems="flex-start" spacing={6} maxW="500px">
          <SectionTitle fontFamily="Ubuntu" fontSize="28px">
            Faça parte de nossa rede de parceiros e clientes
          </SectionTitle>
          <SectionText letterSpacing="0.1em">
            <b>
              Fortalecemos o uso eficaz e escalável de dados em governos,
              empresas e organizações.
            </b>{" "}
            Abra dados de sua organização, construa projetos de dados abertos
            conosco ou desenvolva aplicações com nossos dados.
          </SectionText>
          <Link textDecoration="none !important" href="/blog/1/">
            <RoundedButton
              fontFamily="Ubuntu"
              fontSize="18px"
              width="250px"
              height="45px"
            >
              Entre em contato
            </RoundedButton>
          </Link>
        </VStack>
        <VStack spacing={5}>
          <HStack spacing={5}>
            <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/tesouro_nacional.png" />
            <PartnerBox
              padding="0px 10px"
              src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/fiquem_sabendo.png"
            />
            <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/governosp.png" />
            <PartnerBox
              padding="0px 20px"
              src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/riomais.png"
            />
          </HStack>
          <HStack spacing={5}>
            <PartnerBox
              padding="0px 20px"
              src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/ipea.png"
            />
            <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/alziras.png" />
            <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/rio.png" />
            <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/aponte.png" />
          </HStack>
        </VStack>
      </Stack>
      <VStack paddingTop="50px" width="100%">
        <Image
          width="60px"
          paddingBottom="15px"
          alignSelf="flex-start"
          src="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/%E2%80%9C.png"
        />
        <SectionText
          paddingLeft="50px"
          paddingBottom="20px"
          textAlign="justify"
          lineHeight="30px"
        >
          Com o apoio da Base dos Dados realizamos o{" "}
          <b>
            levantamento das desigualdades de gênero e raça nas eleições
            2016-2020
          </b>{" "}
          e das{" "}
          <b>
            distorções de financiamento de campanhas de prefeitas e vereadoras
          </b>{" "}
          nas últimas eleições, o que resultará no lançamento de uma publicação
          inédita.
        </SectionText>
        <NamedAvatar
          alignSelf="flex-end"
          name="Marina Barros"
          position="Diretora-Executiva do Instituto Alziras"
          src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/alziras.png"
        />
      </VStack>
    </VStack>
  );
}
