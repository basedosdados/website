import {
  Box,
  VStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { isMobileMod, useCheckMobile } from "../hooks/useCheckMobile.hook";
import Display from "../components/atoms/Display";
import { MainPageTemplate } from "../components/templates/main";
import ServiceTerms from "../content/serviceTerms";
import PrivacyPolicy from "../content/privacyPolicy";
import { withPages } from "../hooks/pages.hook";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getStaticProps({ locale }) {
  const pages = await withPages();
  return {
    props: {
      ...pages,
      ...(await serverSideTranslations(locale, ['common', 'menu', 'terms'])),
    },
  };
}

export default function TermsAndPolicies() {
  const { t } = useTranslation('terms');
  const router = useRouter()
  const { query } = router
  const [sectionSelected, setSectionSelected] = useState("")

  function movedScroll(value) {
    window.scrollTo({
      top: value,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const id = query?.section
    let targetElement = ""

    if(id === "terms") {
      targetElement = document.getElementById("Terms Of Service")
      setSectionSelected("Terms Of Service")
      movedScroll(useCheckMobile() ? 210 : 120)
    }
    if(id === "privacy") {
      targetElement = document.getElementById("Privacy Policy")
      setSectionSelected("Privacy Policy")
      movedScroll(targetElement?.offsetTop+120)
    }
  },[query?.section])

  const SectionText = ({ section }) => {
    function handlerClick(elm) {
      if(elm === sectionSelected) {
        setSectionSelected("")
        window.scrollTo({top: 1})
      } else {
        setSectionSelected(elm)
        const targetElement = document.getElementById(elm)

        if (targetElement) {
          if(targetElement.id === "Terms Of Service") {
            movedScroll(useCheckMobile() ? 210 : 80)
          } else {
            movedScroll(targetElement?.offsetTop+120)
          }
        }
        router.push({
          pathname: router.pathname,
          query: { section: targetElement.getAttribute("name")}
        })
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
        {t(section)}
      </Text>
    )
  }

  return (
    <MainPageTemplate paddingX="24px">
      <Head>
        <title>{t('pageTitle')}</title>
        <meta
          property="og:title"
          content={t('ogTitle')}
          key="ogtitle"
        />
      </Head>

      <VStack
        width="100%"
        maxWidth="1264px"
        margin="50px auto 0"
        spacing={0}
      >
        <Display
          paddingBottom={isMobileMod() ? "56px" : "66px" }
          color="#2B8C4D"
        >
          {t('mainTitle')}
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
            <SectionText section="Terms Of Service"/>
            <SectionText section="Privacy Policy"/>
          </Box>

          <Stack
            width="100%"
            spacing="80px"
          >
            <VStack
              id="Terms Of Service"
              name="terms"
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
              >{t('termsOfService')}</Text>
              <ServiceTerms/>
            </VStack>

            <VStack
              id="Privacy Policy"
              name="privacy"
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
              >{t('privacyPolicy')}</Text>
              <PrivacyPolicy/>
            </VStack>
          </Stack>
        </Stack>
      </VStack>
    </MainPageTemplate>
  )
}
