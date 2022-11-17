import {
  Stack,
  VStack,
  HStack,
  Image,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Head from "next/head";
import { MainPageTemplate } from "../../components/templates/main";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import { CaseStudiesCotent } from "../../content/caseStudies";
import SectionText from "../../components/atoms/SectionText";
import Display from "../../components/atoms/Display";
import BodyText from "../../components/atoms/BodyText";
import RoundedButton from "../../components/atoms/RoundedButton";
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

export default function CaseStudies ({
  title,
  displayTitle,
  thumbnail,
  img,
  imgDescription,
  description,
  logo,
  about,
  sector,
  body
}) {
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  return (
    <MainPageTemplate paddingX="24px">
      <Head>
        <title>{displayTitle} – Base dos Dados</title>
        <link
          rel="image_src"
          href={thumbnail}
        />
        <meta
          property="og:image"
          content={thumbnail}
          key="ogimage"
        />
        <meta
          name="twitter:image"
          content={thumbnail}
          key="twimage"
        />
        <meta
          property="og:title"
          content={`${displayTitle} – Base dos Dados`}
          key="ogtitle"
        />
        <meta
          property="og:description"
          content={`${description}`}
          key="ogdesc"
        />
      </Head>

      <Stack
        spacing={0}
        maxWidth="1264px"
        margin="auto"
      >
        {isMobileMod &&
          <Display
              paddingTop={isMobileMod && "80px"}
              marginBottom="48px"
          >{title}</Display>
        }
        
        <VStack position="relative" spacing={0} gridGap="16px">
          {!isMobileMod &&
            <Display
              position="absolute"
              paddingTop={isMobileMod && "80px"}
              margin="40px 48px"
              color="#FFF"
              zIndex="10"
            >{title}</Display>
          }

          <Image
            alt={displayTitle}
            filter={!isMobileMod && "brightness(0.5)"}
            width="fit-content"
            maxWidth="100%"
            height="fit-content"
            maxHeight="450px"
            borderRadius={isMobileMod ? "12px" : "24px"}
            src={img}
          />

          {imgDescription && 
            <SectionText
              width="100%"
              textAlign="end"
              color="#6F6F6F"
            >
              {imgDescription}
            </SectionText>
          }
        </VStack>
        
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
            maxWidth="300px"
            alignItems="flex-start"
          >
            <Image
              alt={displayTitle}
              marginBottom="32px"
              width="fit-content"
              height="fit-content"
              src={logo}
            />
            <BodyText  fontSize="16px" letterSpacing="0.2px" fontWeight="400">Sobre</BodyText>
            <BodyText paddingBottom="32px" fontSize="16px" letterSpacing="0.2px" color="#6F6F6F">
              {about}
            </BodyText>

            <BodyText  fontSize="16px" letterSpacing="0.2px" fontWeight="400">Setor</BodyText>
            <BodyText paddingBottom="48px" fontSize="16px" letterSpacing="0.2px" color="#6F6F6F">
              {sector}
            </BodyText>

            <BodyText paddingBottom="8px">
              Queremos ajudar você.
            </BodyText>
            <RoundedButton
              onClick={() => window.open("/contato", "_blank")}
            >
              Entre em contato
            </RoundedButton>
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