import {
  Stack,
} from "@chakra-ui/react";
import Head from "next/head";
import Display from "../../components/atoms/Display";
import SectionTitle from "../../components/atoms/SectionTitle";
import { MainPageTemplate } from "../../components/templates/main";

export default function CaseStudies ({}) {
  

  return (
    <MainPageTemplate paddingX="24px">
      <Head>
        <title>Estudos de caso – Base dos Dados</title>
        <meta
          property="og:title"
          content="Estudos de caso – Base dos Dados"
          key="ogtitle"
        />
      </Head>

      <Stack
        maxWidth="1264px"
        margin="auto"
        spacing={0}
      >
        <Display
          fontSize="60px"
          letterSpacing="-1.5px"
          lineHeight="72px"
          textAlign="center"
          marginBottom="16px"
        >
          Estudos de caso
        </Display>
        <SectionTitle
          color="#575757"
          textAlign="center"
          marginBottom="112px !important"
        >
          Descubra por que as instituições ... a Base dos Dados 
        </SectionTitle>

        {/* filtror */}

        <Stack spacing="32px">

        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}