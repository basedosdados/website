import {
  Stack,
  Box,
  Skeleton
} from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

import Display from "../../components/atoms/Display";
import SectionTitle from "../../components/atoms/SectionTitle";
import BodyText from "../../components/atoms/BodyText";
import Link from "../../components/atoms/Link";
import { MainPageTemplate } from "../../components/templates/main";
import { CaseStudiesPaged } from "../../content/caseStudies";

export default function CaseStudies ({}) {
  const [CaseStudiesPages, setCaseStudiesPages] = useState([])
  
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

        {/* filtro */}

        <Stack
          flexWrap="wrap"
          flexDirection="row"
          gridGap="32px"
          spacing={0}
          marginBottom="120px !important"
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
                width="400px"
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
                {elm.about}
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