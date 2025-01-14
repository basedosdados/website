import {
    Box,
    VStack,
    Stack,
    Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from "../components/atoms/Link";
import { MainPageTemplate } from "../components/templates/main";
import { withPages } from "../hooks/pages.hook";

export async function getStaticProps({ locale }) {
  const pages = await withPages();
  return {
    props: {
      ...pages,
      ...(await serverSideTranslations(locale, ['common', 'menu', 'contact'])),
    },
  };
}

const Display = ({ children, ...props }) => (
  <Text
    fontFamily="Roboto"
    fontWeight="500"
    fontSize="36px"
    lineHeight="48px"
    color="#2B8C4D"
    {...props}
  >
    {children}
  </Text>
);

const BodyText = ({ children, ...props }) => (
  <Text
    fontFamily="Roboto"
    fontWeight="400"
    fontSize="16px"
    lineHeight="24px"
    color="#71757A"
    {...props}
  >
    {children}
  </Text>
);

const Subtitle = ({ children, ...props }) => (
  <Text
    fontFamily="Roboto"
    fontWeight="500"
    fontSize="20px"
    lineHeight="30px"
    color="#252A32"
    {...props}
  >
    {children}
  </Text>
);

export default function Contact({ pages }) {
  const { t } = useTranslation('contact');
  const { locale } = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src='https://js.hsforms.net/forms/v2.js';
    document.body.appendChild(script);

    script.addEventListener('load', () => {
      if (window.hbspt) {
        const formIds = {
          en: "93a67d53-74ce-43bb-ad53-56ec4fd39cbd",
          es: "50fc5a64-fa29-4360-b1b4-28f519aede79",
          pt: "3c85cc81-2b91-4a90-b3ff-41412dfed25e",
        };

        window.hbspt.forms.create({
          region: "na1",
          portalId: "9331013",
          formId: formIds[locale],
          target: '#form-hbspt'
        })
      }
    })
  },[locale])
    
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
          <Box contentalign="flex-start">
            <Display marginBottom="16px">
              {t('contactTitle')}
            </Display>
            <BodyText marginBottom="32px">
              {t('contactDescription')}
            </BodyText>

            <Subtitle marginBottom="8px">
              {t('institutionalSupportTitle')}
            </Subtitle>
            <BodyText marginBottom="32px">
              {t('institutionalSupportDescription')}
            </BodyText>

            <Subtitle marginBottom="8px">
              {t('servicesTitle')}
            </Subtitle>
            <BodyText marginBottom="32px">
              {t('servicesDescription')}
              <Link
                display="inline"
                href="/services"
                color="#0068C5"
                _hover={{color: "#0057A4"}}
                fontSize="16px"
                fontWeight="400"
              >
                {t('servicesLink')}
              </Link> {t('servicesLinkText')}
            </BodyText>

            <Subtitle marginBottom="8px">
              {t('projectsPartnershipsTitle')}
            </Subtitle>
            <BodyText marginBottom="32px">
              {t('projectsPartnershipsDescription')}
            </BodyText>

            <Subtitle marginBottom="8px">
              {t('dataTitle')}
            </Subtitle>
            <BodyText marginBottom="16px">
              {t('dataDescription')}
            </BodyText>
            <BodyText>
              {t('questionsText')}
              <Link
                display="inline"
                href="https://discord.gg/huKWpsVYx4"
                color="#0068C5"
                _hover={{color: "#0057A4"}}
                fontSize="16px"
                fontWeight="400"
                target="_blank"
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
