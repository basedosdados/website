import {
    Box,
    VStack,
    Stack,
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";
import Display from "../components/atoms/Display";
import Subtitle from "../components/atoms/Subtitle";
import BodyText from "../components/atoms/BodyText";
import Link from "../components/atoms/Link";
import { MainPageTemplate } from "../components/templates/main";
import { withPages } from "../hooks/pages.hook";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getStaticProps({ locale }) {
  const pages = await withPages();
  return {
    props: {
      ...pages,
      ...(await serverSideTranslations(locale, ['common', 'menu', 'contact'])),
    },
  };
}

export default function Contato({ pages }) {
  const { t } = useTranslation('contact');

  useEffect(() => {
    const script = document.createElement('script');
    script.src='https://js.hsforms.net/forms/v2.js';
    document.body.appendChild(script);

    script.addEventListener('load', () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          region: "na1",
          portalId: "9331013",
          formId: "3c85cc81-2b91-4a90-b3ff-41412dfed25e",
          target: '#form-hbspt'
        })
      }
    })
  },[])
    
  return (
    <MainPageTemplate paddingX="24px">
      <Head>
        <title>{t('pageTitle')}</title>
        <meta
          property="og:title"
          content={t('pageTitle')}
          key="ogtitle"
        />
        <meta
          property="og:description"
          content={t('pageDescription')}
          key="ogdesc"
        />
      </Head>

      <Stack
        gridGap={{base:"40px", lg: "100px"}}
        width="100%"
        maxWidth="1264px"
        justify="space-between"
        direction={{ base: "column", lg: "row" }}
        margin="50px auto auto"
      >
        <VStack maxWidth={{ base: "100%", lg: "45%" }}>
          <Box contentAlign="flex-start">
            <Display
              fontSize="34px"
              lineHeight="40px"
              letterSpacing="-0.6px" 
              color="#2B8C4D"
              paddingBottom="16px"
            >
              {t('contactTitle')}
            </Display>
            <BodyText fontSize="16px" letterSpacing="0.2px" paddingBottom="32px">
              {t('contactDescription')}
            </BodyText>
            <Subtitle fontSize="18px" letterSpacing="0.1px" paddingBottom="8px">
              {t('institutionalSupportTitle')}
            </Subtitle>
            <BodyText fontSize="16px" letterSpacing="0.2px" paddingBottom="32px">
              {t('institutionalSupportDescription')}
            </BodyText>
            <Subtitle fontSize="18px" letterSpacing="0.1px" paddingBottom="8px">
              {t('servicesTitle')}
            </Subtitle>
            <BodyText fontSize="16px" letterSpacing="0.2px" paddingBottom="32px">
              {t('servicesDescription')}
              <Link
                href="/servicos"
                textDecoration="none"
                fontFamily="Ubuntu"
                color="#42B0FF"
                fontSize="16px"
                fontWeight="500"
                letterSpacing="0.2px"
              >
                {t('servicesLink')}
              </Link> {t('servicesLinkText')}
            </BodyText>
            <Subtitle fontSize="18px" letterSpacing="0.1px" paddingBottom="8px">
              {t('projectsPartnershipsTitle')}
            </Subtitle>
            <BodyText fontSize="16px" letterSpacing="0.2px" paddingBottom="32px">
              {t('projectsPartnershipsDescription')}
            </BodyText>
            <Subtitle fontSize="18px" letterSpacing="0.1px" paddingBottom="8px">
              {t('dataTitle')}
            </Subtitle>
            <BodyText fontSize="16px" letterSpacing="0.2px" paddingBottom="16px">
              {t('dataDescription')}
            </BodyText>
            <BodyText fontSize="16px" letterSpacing="0.2px" fontWeight="500">
              {t('questionsText')}
              <Link
                href="https://discord.gg/huKWpsVYx4"
                textDecoration="none"
                fontFamily="Ubuntu"
                color="#42B0FF"
                target="_blank"
                fontSize="16px"
                fontWeight="500"
                letterSpacing="0.2px"
              >
                {t('discordLink')}<a style={{color:"#252A32", fontWeight:"500"}}>.</a>
              </Link>
            </BodyText>
          </Box>
        </VStack>
        <Stack paddingTop="20px" >
          <Box 
            width="100%"
            minWidth={{base:"100%", lg: "500px"}} 
            maxWidth="500px"
            height="100%" 
            maxHeight="600px" 
            id="form-hbspt"
          />
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}
