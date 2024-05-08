import {
  Stack,
  VStack,
  HStack,
  Box,
  Skeleton,
} from "@chakra-ui/react";
import Image from 'next/image';
import { useState, useEffect } from "react";
import Head from "next/head";

import { MainPageTemplate } from "../../components/templates/main";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import { CaseStudiesContent } from "../../content/caseStudies";
import Link from "../../components/atoms/Link";
import SectionText from "../../components/atoms/SectionText";
import Display from "../../components/atoms/Display";
import BodyText from "../../components/atoms/BodyText";
import RoundedButton from "../../components/atoms/RoundedButton";
import styles from "../../styles/caseStudies.module.css";

export async function getStaticProps(context) {
  return {
    props : CaseStudiesContent.find((res) => res.id === context.params.id),
    revalidate: 30
  } 
}

export async function getStaticPaths(context) {
  return {
    paths: CaseStudiesContent.map((elm) => {
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
        margin="50px auto auto"
      >
        {!isMobileMod &&
          <Link
            marginBottom="48px"
            color="#42B0FF"
            fontWeight="500"
            fontFamily="ubuntu"
            fontSize="16px"
            width="fit-content"
            href={"/estudos-de-caso"}
          >{`<< Voltar`}</Link>
        }

        {isMobileMod &&
          <Display
            margin="0 0 48px !important"
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

          <Box
            position="relative"
            width="100%"
            height={isMobileMod ? "145px" : "450px"}
            overflow="hidden"
            borderRadius={isMobileMod ? "12px" : "24px"}
            filter={!isMobileMod && "brightness(0.4)"}
          >
            {img.length > 0 ?
              <Image
                alt={displayTitle}
                src={img}
                layout="fill"
                objectFit="cover"
              />
            :
              <Skeleton width="100%" height="100%"/>
            }
          </Box>

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
            <Box
              position="relative"
              width="100%"
              height="85px"
              overflow="hidden"
              marginBottom="32px"
            >
              {logo?.img.length > 0 ?
                <Image
                  alt={displayTitle}
                  src={logo.img}
                  width={logo.width}
                  height={logo.height}
                />
              :
                <Skeleton width="245px" height="85px"/>
              }
            </Box>

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