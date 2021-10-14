import { Image } from "@chakra-ui/image";
import { HStack, Stack, VStack } from "@chakra-ui/layout";
import BigTitle from "../atoms/BigTitle";
import Link from "../atoms/Link";
import RoundedButton from "../atoms/RoundedButton";
import SectionText from "../atoms/SectionText";
import { ShadowBox } from "../atoms/ShadowBox";

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
    <VStack spacing={7}>
      <BigTitle>Faça parte da nossa rede de parcerias</BigTitle>
      <SectionText>
        Abra dados de sua organização, construa{" "}
        <b>projetos de dados abertos conosco</b> ou desenvolva aplicações com
        nossos dados.
      </SectionText>
      <Link href="/blog/1/">
        <RoundedButton>Entre em contato</RoundedButton>
      </Link>
      <Stack
        paddingTop="30px"
        spacing={5}
        direction={{ base: "column", lg: "row" }}
      >
        <HStack spacing={5}>
          <PartnerBox
            padding="0px 10px"
            src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/fiquem_sabendo.png"
          />
          <PartnerBox src="" />
        </HStack>
        <HStack spacing={5}>
          <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/tesouro_nacional.png" />
          <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/governosp.png" />
        </HStack>
        <HStack spacing={5}>
          <PartnerBox
            padding="0px 20px"
            src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/riomais.png"
          />
          <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/aponte.png" />
        </HStack>
      </Stack>
    </VStack>
  );
}
