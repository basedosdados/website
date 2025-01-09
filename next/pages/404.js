import {
  Text,
  Center
} from "@chakra-ui/react";
import FourOrFourTemplate from "../components/templates/404";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MainPageTemplate } from "../components/templates/main";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu',])),
    },
  };
}

export default function FourOFour() {
  return (
    <MainPageTemplate>
      <FourOrFourTemplate 
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
          >Infelizmente não encontramos essa página.</Text>
          <Text
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="18px"
            lineHeight="26px"
            color="#252A32"
          >Navegue pelo menu ali em cima ou busque os dados que voce precisa na barra de pesquisa.</Text>
        </Center>
      </FourOrFourTemplate>
    </MainPageTemplate>
  )
}