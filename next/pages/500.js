import {
  Text,
  Center,
  Box
} from "@chakra-ui/react";
import FiveHundredTemplate from "../components/templates/500";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MainPageTemplate } from "../components/templates/main";
import Link from "../components/atoms/Link";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu',])),
    },
  };
}

export default function InternalServerError() {
  return (
    <MainPageTemplate>
      <FiveHundredTemplate 
        alignItems={{base: "flex-end", lg: "center"}}
        marginTop={{base: "120px", md: "0"}}
        padding="80px 24px"
      >
        <Text
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="50px"
          lineHeight="60px"
          color="#252A32"
          marginBottom="24px"
        >Ooops...</Text>
        <Center flexDirection="column" marginBottom="24px" gap="8px">
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="28px"
            lineHeight="42px"
            color="#252A32"
          >Infelizmente ocorreu um erro.</Text>
          <Text
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="18px"
            lineHeight="26px"
            color="#252A32"
          >Verifique o status da nossa plataforma e tente acessar novamente mais tarde.</Text>
        </Center>
        <Link
          target="_blank"
          href="https://status.basedosdados.org/"
        >
          <Box
            as="button"
            target="_self"
            display="flex"
            alignItems="center"
            height="54px"
            width="fit-content"
            borderRadius="8px"
            backgroundColor="#0D99FC"
            padding="10px 16px"
            cursor="pointer"
            color="#FFF"
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="20px"
            lineHeight="30px"
            _hover={{
              backgroundColor: "#0B89E2"
            }}
          >
            Confira o status
          </Box>
        </Link>
      </FiveHundredTemplate>
    </MainPageTemplate>
  )
}