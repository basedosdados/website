import {
    Box,
    Stack,
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";
import { MainPageTemplate } from "../components/templates/main";
import { withPages } from "../hooks/pages.hook";

export async function getStaticProps() {
  return await withPages()
}

export default function ContactConsultancy() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src='https://js.hsforms.net/forms/embed/v2.js';
    document.body.appendChild(script);

    script.addEventListener('load', () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          region: "na1",
          portalId: "9331013",
          formId: "1b1d4a12-5cbc-4ffc-837a-12b905c2d87b",
          target: '#form-hbspt'
        })
      }
    })
  },[])
    
  return (
    <MainPageTemplate paddingX="24px">
      <Head>
        <title>Consultoria – Base dos Dados</title>
        <meta
          property="og:title"
          content="Consultoria – Base dos Dados"
          key="ogtitle"
        />
        <meta
          property="og:description"
          content="Entre em contato com nossa equipe."
          key="ogdesc"
        />
      </Head>

      <Stack
        width="100%"
        maxWidth="1264px"
        alignItems="center"
        margin="0 auto"
      >
        <Box 
          width="100%"
          minWidth={{base:"100%", lg: "800px"}} 
          maxWidth="500px"
          height="100%" 
          id="form-hbspt"
          boxShadow="none !important"
        />
      </Stack>
    </MainPageTemplate>
  )
}
