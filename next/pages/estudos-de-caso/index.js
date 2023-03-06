import {
  Stack,
  Box,
  Skeleton
} from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

import BodyText from "../../components/atoms/BodyText";
import Display from "../../components/atoms/Display";
import SectionTitle from "../../components/atoms/SectionTitle";
import Link from "../../components/atoms/Link";
import { MainPageTemplate } from "../../components/templates/main";
import { CaseStudiesPaged } from "../../content/caseStudies";

export default function CaseStudies ({}) {
  const [CaseStudiesPages, setCaseStudiesPages] = useState([])
  const [isMobileMode, setIsMobileMode] = useState(false)
  
  const isMobile = useCheckMobile()

  useEffect(() => {
    setIsMobileMode(isMobile)
  },[isMobile])

  useEffect(() => {
    setCaseStudiesPages(CaseStudiesPaged())
  },[])

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
        paddingTop={isMobileMode && "80px"}
        spacing={0}
      >
        <Display
          fontSize={isMobileMode ? "34px" : "60px"}
          letterSpacing={isMobileMode ? "-0.4px" : "-1.5px"}
          lineHeight={isMobileMode ? "44px" : "72px"}
          textAlign="center"
          marginBottom={isMobileMode ? "8px" : "16px"}
        >
          Nossas soluções
        </Display>
        <SectionTitle
          color="#575757"
          textAlign="center"
          marginBottom={isMobileMode ? "80px !important" : "112px !important"}
          lineHeight={isMobileMode ? "32px" : "40px"}
        >
          Descubra por que as instituições escolhem inovar com a Base dos Dados
        </SectionTitle>

        {/* filtro */}

        <Stack
          flexWrap="wrap"
          flexDirection="row"
          gridGap="32px"
          spacing={0}
          marginBottom="120px !important"
          justifyContent={isMobileMode && "center"}
        >
          {CaseStudiesPages.length > 0 && 
          CaseStudiesPages.map(elm => 
            <Stack
              key={elm.id}
              width="400px"
              spacing={0}
            >
              {/* Imagem banner */}
              <Box
                position="relative"
                width={isMobileMode ? "100%" : "400px"}
                height="145px"
                overflow="hidden"
                borderRadius="16px"
                marginBottom="24px"
              >
                {elm?.img.length > 0 ?
                  <Image
                    alt={elm.displayTitle}
                    src={elm.img}
                    layout="fill"
                    objectFit="cover"
                  />
                  :
                  <Skeleton width="100%" height="100%"/>
                }
              </Box>

              {/* Imagem logo */}
              <Box
                position="relative"
                width="100%"
                height="45px"
                overflow="hidden"
                marginBottom="16px !important"
              >
                {elm?.logo.img.length > 0 ?
                  <Image
                    alt={elm.displayTitle}
                    src={elm.logo.img}
                    width={elm.logo.width/2}
                    height={elm.logo.height/2}
                  />
                  :
                  <Skeleton width="120px" height="100%"/>
                }
              </Box>

              <BodyText marginBottom="18px !important">
                {elm.resume.slice(0,isMobileMode ? 160 :175)+"..."}
              </BodyText>

              <Link
                fontFamily="ubuntu"
                fontWeight="500"
                letterSpacing="0.1px"
                fontSize="18px"
                lineHeight="20px"
                target="_self"
                href={`/estudos-de-caso/${elm.id}`}
                color="#42B0FF"
                marginBottom="40px !important"
              >
                Leia o estudo de caso
              </Link>
            </Stack>
          )}
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}