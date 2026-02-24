import { useState } from "react";
import {
  Box,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Head from "next/head";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { MainPageTemplate } from "../components/templates/main";
import { withPages } from "../hooks/pages.hook";
import { isMobileMod } from "../hooks/useCheckMobile.hook";

import { getAllFAQs } from "./api/faqs";

import Display from "../components/atoms/Text/Display";
import TitleText from "../components/atoms/Text/TitleText";
import BodyText from "../components/atoms/Text/BodyText";
import MentionSection from "../components/molecules/MentionSection";
import GreenTab from "../components/atoms/GreenTab";
import Carousel from "../components/atoms/Carousel";
import { SectionPrice } from "../pages/prices";
import BDLogoProImage from "../public/img/logos/bd_logo_pro";
import QuestionsBox from "../components/molecules/QuestionsBox";

import styles from "../styles/bdpro.module.css";
import stylesFaq from "../styles/faq.module.css";

export async function getStaticProps({ locale }) {
  const faqs = await getAllFAQs(locale, "bdPro/FAQ")
  const pagesProps = await withPages();
  return {
    props: {
      ...pagesProps,
      ...(await serverSideTranslations(locale, ['common', 'menu', 'bdpro', 'prices'])),
      faqs
    },
    revalidate: 30
  };
}

function HighlightBox({ title, description, cn, isActive, onActivate, onDeactivate }) {
  const isMobile = isMobileMod();

  return (
    <Box 
      className={`${styles['float-pill']} ${styles[cn]}`} 
      position="relative" 
      display="flex" 
      justifyContent="center" 
      alignItems="center"
      zIndex={isActive ? 10 : 1}
    >
      <Box padding="10px 16px" visibility="hidden">
        <BodyText fontSize="16px" lineHeight="24px" whiteSpace="nowrap">
          {title}
        </BodyText>
      </Box>

      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform={isActive ? "translate(-50%, calc(-50% - 3px))" : "translate(-50%, -50%)"}
        cursor="pointer"
        onMouseEnter={() => !isMobile && onActivate()}
        onMouseLeave={() => !isMobile && onDeactivate()}
        onClick={() => {
          if (isMobile) {
            isActive ? onDeactivate() : onActivate();
          }
        }}
        padding={isActive ? "12px 16px" : "10px 16px"}
        color="#FFFFFF"
        backgroundColor="#161d19bf"
        border="1px solid #ffffff1a"
        borderRadius="14px"
        textAlign="center"
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        backdropFilter="blur(4px)"
        width="max-content"
        maxWidth="260px"
        zIndex={isActive ? 10 : 1}
        _hover={{
          borderColor: "#29b47366",
          background: "#29b47314",
          color: "#29b473",
          boxShadow: "0 8px 32px rgba(41,180,115,0.15)",
        }}
      >
        <BodyText 
          color="currentcolor" 
          fontWeight={isActive ? "400" : "500"}
          fontSize={isActive ? "14px" : "16px"}
          lineHeight={isActive ? "22px" : "24px"}
          whiteSpace={isActive ? "normal" : "nowrap"}
        >
          {isActive ? description : title}
        </BodyText>
      </Box>
    </Box>
  );
}

function Hero({ t }) {
  const [activeHightlight, setActiveHightlight] = useState(null);

  const highlights = [
    { key: 'cnpjs', top: "10%", left: "26%", cn: "cnpjs" },
    { key: 'obras', top: "22%", right: "16%", cn: "obras" },
    { key: 'datasus', bottom: "50%", left: "3%", transform: "translateY(-50%)", cn: "datasus" },
    { key: 'empregos', bottom: "18%", right: "4%", transform: "translateY(-50%)", cn: "empregos" },
    { key: 'comex', top: "76%", left: "6%", transform: "translateY(-50%)", cn: "comex" },
  ];

  return (
    <Box
      position="relative"
      width="100%"
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center"
      minHeight={{ base: "800px", lg: "700px" }}
      backgroundColor="#0a2213"
      bgGradient="radial-gradient(ellipse 70% 55% at 50% 45%, rgba(41,180,115,0.13) 0%, transparent 70%),
        radial-gradient(ellipse 40% 30% at 15% 60%, rgba(41,180,115,0.07) 0%, transparent 60%),
        radial-gradient(ellipse 40% 30% at 85% 35%, rgba(41,180,115,0.07) 0%, transparent 60%);"
      padding="40px 24px"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        opacity="0.4"
        zIndex="1"
        width="100%"
        height="100%"
        bgGradient="linear-gradient(#ffffff1a 1px, transparent 1px),
          linear-gradient(90deg, #ffffff1a 1px, transparent 1px);"
        backgroundSize="60px 60px"
        sx={{
          WebkitMaskImage:
            "radial-gradient(circle at center, black 30%, transparent 80%)",
          maskImage:
            "radial-gradient(circle at center, black 30%, transparent 80%)",
        }}
      />
      <VStack
        gap="16px"
        spacing="0"
        textAlign="center"
        zIndex="2"
      >
        <BDLogoProImage widthImage="160px" heightImage="40px" marginBottom="16px" />
        <Display
          as="h1"
          typography={isMobileMod() ? "small" : "medium"}
          maxWidth="800px"
          color="white"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Box as="span">{t('hero.title',{ returnObjects: true })[0]}</Box>
          <Box as="span">{t('hero.title',{ returnObjects: true })[1]}</Box>
        </Display>
        <TitleText
          as="h2"
          maxWidth="850px"
          typography={isMobileMod() ? "small" : "medium"}
          fontWeight="400"
          color="#ffffffc7"
        >
          {t('hero.description')}
        </TitleText>
        <BodyText
          as="h3"
          typography={isMobileMod() ? "small" : "medium"}
          color="#ffffffc7"
        >
          {t('hero.stats')}
        </BodyText>
      </VStack>

      <Box
        position="absolute"
        width="1280px"
        height="100%"
        zIndex="3"
        display={{ base: "none", lg: "block" }}
      >
        {highlights.map((h) => (
          <Box
            key={h.key}
            position="absolute"
            top={h.top}
            left={h.left}
            right={h.right}
            bottom={h.bottom}
            transform={h.transform}
            zIndex={activeHightlight === h.key ? 10 : 1}
          >
            <HighlightBox
              title={t(`hero.highlights.${h.key}.title`)}
              description={t(`hero.highlights.${h.key}.description`)}
              cn={h.cn}
              isActive={activeHightlight === h.key}
              onActivate={() => setActiveHightlight(h.key)}
              onDeactivate={() => setActiveHightlight(null)}
            />
          </Box>
        ))}
      </Box>

      <Box
        display={{ base: "flex", lg: "none" }}
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
        gap="12px"
        width="90%"
        marginTop="40px"
        zIndex="3"
      >
        {highlights.map((h) => (
          <HighlightBox
            key={h.key}
            title={t(`hero.highlights.${h.key}.title`)}
            description={t(`hero.highlights.${h.key}.description`)}
            cn={h.cn}
            isActive={activeHightlight === h.key}
            onActivate={() => setActiveHightlight(h.key)}
            onDeactivate={() => setActiveHightlight(null)}
          />
        ))}
      </Box>
    </Box>
  );
}

function Presentation({ t }) {
  const tabs = [1, 2, 3];
  const isMobile = isMobileMod();

  return (
    <VStack width="100%" padding="80px 24px" spacing="24px">
      <Display
        as="h2"
        typography={isMobile ? "small" : "medium"}
        width="100%"
        maxWidth="800px"
        textAlign="center"
        margin="0 auto"
      >
        {t('presentation.title')}
      </Display>
      <Tabs variant="unstyled" align="center" width="100%" maxWidth="1440px" margin="0 auto">
        <TabList
          borderBottom="1px solid #DEDFE0"
          width="100%"
          justifyContent={{ base: "flex-start", md: "center" }}
          overflowX={{ base: "auto", md: "visible" }}
          overflowY="hidden"
          paddingBottom="4px"
          sx={{
            '::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {tabs.map((i) => (
            <GreenTab 
              key={i} 
              whiteSpace="nowrap" 
              flexShrink="0"
            >
              {t(`presentation.tabs.tab${i}.label`)}
            </GreenTab>
          ))}
        </TabList>
        <TabPanels>
          {tabs.map((i) => (
            <TabPanel
              key={i}
              padding="24px 0"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              gap="24px"
            >
              <TitleText
                as="h3"
                maxWidth="850px"
                typography={isMobileMod() ? "small" : "small"}
                fontWeight="400"
                color="#464A51"
              >
                {t(`presentation.tabs.tab${i}.description`)}
              </TitleText>

              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="100%"
                height={{ base: "auto", md: "450px" }}
                minHeight={{ base: "250px", md: "450px" }}
                backgroundColor="#F9F9F9"
                boxShadow="0px 1.6px 16px rgba(100, 96, 103, 0.16)"
                borderRadius="16px"
              >

              </Box>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </VStack>
  );
}

function Testimonials({ t }) {
  const isMobile = isMobileMod();
  const testimonialKeys = ["t1", "t2"];

  return (
    <VStack
      width="100%"
      padding={{base: "80px 24px 40px", md: "80px 24px 80px"}}
      backgroundColor="#252A32"
      gap={{base: "24px", md: "80px"}}
      spacing="0"
    >
      <Display
        as="h2"
        typography={isMobile ? "small" : "medium"}
        width="100%"
        maxWidth="800px"
        textAlign="center"
        margin="0 auto"
        color="#FFFFFF"
      >
        {t('testimonials.title')}
      </Display>

      <Box
        width="100%"
        maxWidth="1440px"
        position="relative"
        margin="0 auto"
        className={styles.testimonials}
      >
        <Carousel
          settings={{
            slidesPerView: 1,
            navigation: true,
            pagination: { clickable: true },
            loop: true,
            autoplay: {
              delay: 6000,
              pauseOnMouseEnter: true,
              disableOnInteraction: false,
            },
          }}
        >
          {testimonialKeys.map((key) => (
            <Box
              key={key}
              display="flex"
              width="100%"
              justifyContent="center"
            >
              <MentionSection 
                content={t(`testimonials.list.${key}.text`)}
                author={t(`testimonials.list.${key}.name`)}
                position={t(`testimonials.list.${key}.role`)}
                marginTop="0 !important"
                padding={{base: "0 0 40px", md: "0 0 80px"}}
              />
            </Box>
          ))}
        </Carousel>
      </Box>
    </VStack>
  );
}

function PricingSection({ t }) {
  const isMobile = isMobileMod();

  return (
    <VStack
      width="100%"
      padding="80px 24px"
      gap="24px"
      spacing="0"
      backgroundColor="#FAFAFA"
    >
      <Display
        as="h2"
        typography={isMobile ? "small" : "medium"}
        width="100%"
        maxWidth="800px"
        textAlign="center"
        margin="0 auto"
      >
        {t('prices:comparePlans')}
      </Display>
      <SectionPrice />
    </VStack>
  );
}

function FAQ({ t, faqs }) {
  const isMobile = isMobileMod();

  return (
    <VStack
      width="100%"
      maxWidth="800px"
      margin="0 auto"
      padding="80px 24px"
      gap={{base: "40px", md: "80px"}}
      spacing="0"
    >
      <Display
        as="h2"
        typography={isMobile ? "small" : "medium"}
        width="100%"
        maxWidth="800px"
        textAlign="center"
        margin="0 auto"
      >
        {t('faq.title')}
      </Display>

      <VStack
        width="100%"
        spacing={8}
        alignItems="stretch"
      >
        {faqs && faqs.map((elm, i) => (
          <QuestionsBox
            key={i}
            question={elm.question}
            answer={elm.content}
            id={elm.id}
          />
        ))}
      </VStack>
    </VStack>
  );
}

export default function BDProPage({ faqs }) {
  const { t } = useTranslation(['bdpro', 'prices']);

  return (
    <MainPageTemplate>
      <Head>
        <title>{t('head.pageTitle')}</title>
        <meta property="og:title" content={t('head.metaTitle')} key="ogtitle" />
      </Head>
      <Hero t={t} />
      <Presentation t={t} />
      <Testimonials t={t} />
      <PricingSection t={t} />
      <FAQ t={t} faqs={faqs} />
    </MainPageTemplate>
  );
}
