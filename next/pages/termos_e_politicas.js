import {
  Box,
  VStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";
import { isMobileMod, useCheckMobile } from "../hooks/useCheckMobile.hook";
import Display from "../components/atoms/Display";
import { MainPageTemplate } from "../components/templates/main";
import ServiceTerms from "../content/serviceTerms";
import PrivacyPolicy from "../content/privacyPolicy";

export default function TermsAndPolitics() {
  const [sectionSelected, setSectionSelected] = useState("")

  const SectionText = ({ section }) => {
    function handlerClick(elm) {
      if(elm === sectionSelected) {
        setSectionSelected("")
        window.scrollTo({top: 1})
      } else {
        setSectionSelected(elm)
        const targetElement = document.getElementById(elm)

        if (targetElement) {
          if(targetElement.id === "Termos de serviço") {
            window.scrollTo({
              top: useCheckMobile() ? 210 : 80,
              behavior: 'smooth',
            })
          } else {
            window.scrollTo({
              top: targetElement.offsetTop+120,
              behavior: 'smooth',
            })
          }
        }
      }
    }

    return (
      <Text
        fontSize="16px"
        color={sectionSelected === section ? "#2B8C4D" :"#6F6F6F"}
        fontFamily="ubuntu"
        fontWeight="500"
        width="max-content"
        cursor="pointer"
        letterSpacing="0.2px"
        onClick={() => handlerClick(section)}
      >
        {section}
      </Text>
    )
  }

  return (
    <MainPageTemplate paddingX="24px">
      <Head>
        <title>Termos e Políticas – Base dos Dados</title>
        <meta
          property="og:title"
          content="Termos e Políticas – Base dos Dados"
          key="ogtitle"
        />
        {/* <meta
          property="og:description"
          content=""
          key="ogdesc"
        /> */}
      </Head>

      <VStack
        width="100%"
        maxWidth="1264px"
        margin="auto"
        paddingTop={isMobileMod() && "80px"}
        spacing={0}
      >
        <Display
          paddingBottom={isMobileMod() ? "56px" : "66px" }
          color="#2B8C4D"
        >
          Termos e Políticas
        </Display>

        <Stack
          width="100%"
          position="relative"
          gridGap={isMobileMod() ? "64px" : "120px"}
          spacing={0}
          flexDirection={isMobileMod() ? "column" :"row"} 
          paddingBottom="32px"
        >
          <Box
            display="flex"
            height="100%"
            flexDirection="column"
            gridGap="16px"
            position={isMobileMod() ? "relative" : "sticky"}
            top={isMobileMod()? "0" : "120px"}
          >
            <SectionText section="Termos de serviço"/>
            <SectionText section="Políticas de privacidade"/>
            <SectionText section="Cookies"/>
          </Box>

          <Stack
            width="100%"
            spacing="80px"
          >
            <VStack
              id="Termos de serviço"
              width="100%"
              spacing={8}
              alignItems="flex-start"
            >
              <Text
                fontFamily="Ubuntu"
                fontSize="24px"
                lineHeight="40px"
                fontWeight="400"
                color="#252A32"
              >Termos de serviço</Text>
              <ServiceTerms/>
            </VStack>

            <VStack
              id="Políticas de privacidade"
              width="100%"
              spacing={8}
              alignItems="flex-start"
            >
              <Text
                fontFamily="Ubuntu"
                fontSize="24px"
                lineHeight="40px"
                fontWeight="400"
                color="#252A32"
              >Políticas de privacidade</Text>
              <PrivacyPolicy/>
            </VStack>

            <VStack
              id="Cookies"
              width="100%"
              spacing={8}
              alignItems="flex-start"
            >
              <Text
                fontFamily="Ubuntu"
                fontSize="24px"
                lineHeight="40px"
                fontWeight="400"
                color="#252A32"
              >Cookies</Text>
              <Box>
              </Box>
            </VStack>
          </Stack>
        </Stack>
      </VStack>
    </MainPageTemplate>
  )
}