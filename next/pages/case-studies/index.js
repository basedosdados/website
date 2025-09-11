import {
  Stack,
  Box,
  Skeleton,
  Grid
} from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { isMobileMod } from "../../hooks/useCheckMobile.hook";

import Display from "../../components/atoms/Text/Display";
import BodyText from "../../components/atoms/Text/BodyText";
import TitleText from "../../components/atoms/Text/TitleText";
import LabelText from "../../components/atoms/Text/LabelText";
import Link from "../../components/atoms/Link";
import { MainPageTemplate } from "../../components/templates/main";
import { getAllCaseStudies } from "../api/caseStudies";

export async function getStaticProps({ locale }) {
  const caseStudies = await getAllCaseStudies(locale)

  return { 
    props: {
      caseStudies,
      ...(await serverSideTranslations(locale, ['common', 'caseStudies', 'menu'])),
    }
  };
}

export default function CaseStudies ({ caseStudies }) {
  const { t } = useTranslation('caseStudies');

  return (
    <MainPageTemplate>
      <Head>
        <title>{t('pageTitle', { title: "Estudos de caso" })}</title>
        <meta
          property="og:title"
          content={t('metaTitle')}
          key="ogtitle"
        />
      </Head>

      <Stack
        spacing={0}
        padding={{base: "40px 24px 8px", md: "40px 24px 40px"}}
        maxWidth="1440px"
        margin="0 auto"
        boxSizing="content-box"
      >
        <Display
          as="h1"
          typography={isMobileMod() ? "small" : "large"}
          paddingBottom="16px"
        >
          {t('mainTitle')}
        </Display>
        <TitleText
          as="h2"
          typography={isMobileMod() ? "small" : "medium"}
          color="#71757A"
          paddingBottom="32px"
        >
          {t('mainDescription')}
        </TitleText>

        <Grid
          templateColumns={{ base: "1fr", md: "repeat(auto-fit, minmax(454px, 1fr))" }}
          gridGap="32px"
          paddingTop="32px"
        >
          {caseStudies.length > 0 && 
          caseStudies.map(elm => 
            <Stack
              key={elm.id}
              width="100%"
              maxWidth="100%"
              flex={1}
              spacing={0}
              as="article"
            >
              <Box
                position="relative"
                height="145px"
                overflow="hidden"
                borderRadius="16px"
                marginBottom="24px"
                boxShadow="0 1px 8px rgba(0, 0, 0, 0.10)"
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

              <BodyText
                noOfLines={4}
                minHeight="96px"
                marginBottom="18px !important"
              >
                {elm.summary}
              </BodyText>

              <Link
                target="_self"
                href={`/case-studies/${elm.id}`}
                _hover={{
                  opacity: 0.8
                }}
                marginBottom="40px !important"
              >
                <LabelText>
                  {t('readCaseStudy')}
                </LabelText>
              </Link>
            </Stack>
          )}
        </Grid>
      </Stack>
    </MainPageTemplate>
  )
}