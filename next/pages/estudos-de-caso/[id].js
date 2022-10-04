import {
  Stack,
  VStack,
  HStack,
  Box,
  Text
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { MainPageTemplate } from "../../components/templates/main";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import Display from "../../components/atoms/Display";
import BodyText from "../../components/atoms/BodyText";
import { CaseStudiesCotent } from "./content";
import styles from "../../styles/caseStudies.module.css";

export async function getStaticProps(context) {
  return {
    props : CaseStudiesCotent.find((res) => res.id === context.params.id)
  } 
}

export async function getStaticPaths(context) {
  return {
    paths: CaseStudiesCotent.map((elm) => {
      return {params: { id : elm.id }}
    }),
    fallback: false
  }
}

export default function CaseStudies ({ title, about, logo, body }) {
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  return (
    <MainPageTemplate paddingX="24px">
      <Stack
        spacing={0}
        maxWidth="1264px"
        margin="auto"
      >
        <Display
          paddingTop={isMobileMod && "80px"}
          marginBottom="48px"
        >{title}</Display>
        <Box width="100%" height="320px" backgroundColor="#F5F5F6" borderRadius="24px" />
        
        <HStack
          flexDirection={isMobileMod && "column"}
          spacing={0}
          alignItems="flex-start"
          paddingTop="64px"
          position="relative"
          gridGap={isMobileMod ? "40px" : "80px"}
        >
          <VStack
            position={isMobileMod ? "relative" : "sticky"}
            top={!isMobileMod && "100px"}
            marginBottom={isMobileMod && "32px"}
            spacing={0}
            maxWidth="400px"
            alignItems="flex-start"
          >
            <Box marginBottom="32px" width="275px" height="65px" backgroundColor="#F5F5F6"/>
            <BodyText fontWeight="400">Sobre</BodyText>
            <BodyText color="#6F6F6F">
              {about}
            </BodyText>
          </VStack>

          <VStack flex={1}>
            <BodyText>  
              <div className={styles.body} dangerouslySetInnerHTML={{__html: body}} />
            </BodyText>
          </VStack>
        </HStack>
      </Stack>
    </MainPageTemplate>  
  )
}