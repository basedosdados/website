import React, { useState } from "react";
import {
  Box,
  VStack,
  Stack,
  HStack,
  Text,
  Image as ChakraImage,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { MainPageTemplate } from "../components/templates/main";
import Display from "../components/atoms/Text/Display";
import TitleText from "../components/atoms/Text/TitleText";
import BodyText from "../components/atoms/Text/BodyText";
import LabelText from "../components/atoms/Text/LabelText";
import GreenTab from "../components/atoms/GreenTab";
import Carousel from "../components/atoms/Carousel";
import Card from "../components/molecules/Card";
import Button from "../components/atoms/Button";
import Link from "../components/atoms/Link";
import BDLogoProImage from "../public/img/logos/bd_logo_pro";
import { isMobileMod } from "../hooks/useCheckMobile.hook";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu', 'bdpro'])),
    },
    revalidate: 30
  };
}

function HighlightBox({ title, description }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      padding="10px"
      backgroundColor="#F5F5F5"
      borderRadius="10px"
      width="170px"
      height="75px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      transition="all 0.3s"
      cursor="default"
      _hover={{ backgroundColor: "#EBEBEB", transform: "scale(1.05)" }}
    >
      {isHovered ? (
        <BodyText fontSize="11px" lineHeight="14px">{description}</BodyText>
      ) : (
        <TitleText typography="small" fontSize="13px" fontWeight="700">{title}</TitleText>
      )}
    </Box>
  );
}

function Hero({ t }) {
  const isMobile = isMobileMod();

  const highlights = [
    { key: 'cnpjs', top: "-30%", left: "-260px" },
    { key: 'obras', top: "-30%", right: "-260px" },
    { key: 'datasus', bottom: "-55%", left: "-210px" },
    { key: 'empregos', bottom: "-55%", left: "510px"},
    { key: 'comex', top: "50%", left: "-300px", transform: "translateY(-50%)" },
  ];

  if (isMobile) {
    return (
      <VStack spacing={8} padding="40px 24px" width="100%" backgroundColor="#333">
        <VStack spacing={4} textAlign="center">
          <BDLogoProImage widthImage="100px" heightImage="25px" marginBottom="12px" />
          <Display fontSize="26px" lineHeight="32px" color="white">
            {t('hero.title')}
          </Display>
          <BodyText fontSize="15px" color="rgba(255, 255, 255, 0.8)">
            {t('hero.description')}
          </BodyText>
          <LabelText color="rgba(255, 255, 255, 0.6)" fontWeight="500" fontSize="11px">
            {t('hero.stats')}
          </LabelText>
        </VStack>
        <HStack spacing={4} wrap="wrap" justifyContent="center">
          {highlights.map((h) => (
            <HighlightBox
              key={h.key}
              title={t(`hero.highlights.${h.key}.title`)}
              description={t(`hero.highlights.${h.key}.description`)}
            />
          ))}
        </HStack>
      </VStack>
    );
  }

  return (
    <Box 
      width="100%" 
      display="flex" 
      justifyContent="center" 
      alignItems="center"
      position="relative"
      minHeight="700px"
      backgroundColor="#333"
      padding="40px 24px"
    >
      <Box position="relative" maxWidth="550px" width="100%">
        <VStack spacing={5} textAlign="center" position="relative" zIndex="2">
          <BDLogoProImage widthImage="120px" heightImage="30px" marginBottom="16px" />
          <Display fontSize="32px" lineHeight="40px" color="white">
            {t('hero.title')}
          </Display>
          <BodyText fontSize="16px" color="rgba(255, 255, 255, 0.8)">
            {t('hero.description')}
          </BodyText>
          <LabelText color="rgba(255, 255, 255, 0.6)" fontWeight="500" fontSize="13px">
            {t('hero.stats')}
          </LabelText>
        </VStack>

        {highlights.map((h) => (
          <Box
            key={h.key}
            position="absolute"
            top={h.top}
            left={h.left}
            right={h.right}
            bottom={h.bottom}
            transform={h.transform}
            zIndex="1"
          >
            <HighlightBox
              title={t(`hero.highlights.${h.key}.title`)}
              description={t(`hero.highlights.${h.key}.description`)}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function Presentation({ t }) {
  const tabs = [1, 2, 3];

  return (
    <VStack width="100%" padding="80px 24px" spacing={8}>
      <TitleText typography="large">{t('presentation.title')}</TitleText>
      <Tabs variant="unstyled" align="center" width="100%" maxWidth="1200px">
        <TabList borderBottom="1px solid #DEDFE0" width="100%" justifyContent="center">
          {tabs.map((i) => (
            <GreenTab key={i}>{t(`presentation.tabs.tab${i}.label`)}</GreenTab>
          ))}
        </TabList>
        <TabPanels>
          {tabs.map((i) => (
            <TabPanel key={i} padding="40px 0">
              <Box height="400px" bg="gray.100" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                <BodyText>GIF: {t(`presentation.tabs.tab${i}.label`)}</BodyText>
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

  const testimonials = [
    { name: "Pessoa 1", role: "Cargo", text: "Depoimento..." },
    { name: "Pessoa 2", role: "Cargo", text: "Depoimento..." },
    { name: "Pessoa 3", role: "Cargo", text: "Depoimento..." },
  ];

  return (
    <VStack width="100%" padding="80px 24px" backgroundColor="#F7F9FA" spacing={8}>
       <TitleText typography="large">{t('testimonials.title')}</TitleText>
       <Box width="100%" maxWidth="1200px">
         <Carousel
           settings={{
             spaceBetween: 24,
             slidesPerView: isMobile ? 1 : 3,
             pagination: { clickable: true },
             autoplay: { delay: 5000 },
           }}
         >
           {testimonials.map((test, i) => (
             <Card key={i}>
                <VStack alignItems="flex-start" spacing={3} height="100%" justifyContent="center">
                  <BodyText fontStyle="italic">"{test.text}"</BodyText>
                  <Box>
                    <TitleText typography="small">{test.name}</TitleText>
                    <LabelText>{test.role}</LabelText>
                  </Box>
                </VStack>
             </Card>
           ))}
         </Carousel>
       </Box>
    </VStack>
  );
}

function CTAFinal({ t }) {
  return (
    <VStack width="100%" padding="80px 24px" spacing={10} backgroundColor="#252A32">
      <Display color="white" textAlign="center">{t('cta_final.title')}</Display>
      
      <Tabs variant="unstyled" align="center" width="100%" maxWidth="800px">
        <TabList 
          backgroundColor="rgba(255, 255, 255, 0.1)" 
          borderRadius="20px" 
          padding="4px"
          display="inline-flex"
        >
          <Tab
            color="white"
            borderRadius="16px"
            _selected={{ color: "black", bg: "white" }}
            padding="8px 24px"
          >
            <LabelText fontSize="14px">{t('cta_final.groups.individual.label')}</LabelText>
          </Tab>
          <Tab
            color="white"
            borderRadius="16px"
            _selected={{ color: "black", bg: "white" }}
            padding="8px 24px"
          >
            <LabelText fontSize="14px">{t('cta_final.groups.corporate.label')}</LabelText>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel padding="40px 0">
            <VStack spacing={6}>
              <Display color="white" fontSize="48px">{t('cta_final.groups.individual.price')}</Display>
              <Link href="/prices">
                <Button
                  backgroundColor="#2B8C4D"
                  color="#FFFFFF"
                  _hover={{ backgroundColor: "#22703E" }}
                  height="64px"
                  padding="0 48px"
                >
                  <LabelText typography="x-large">{t('cta_final.button')}</LabelText>
                </Button>
              </Link>
            </VStack>
          </TabPanel>
          <TabPanel padding="40px 0">
            <VStack spacing={6}>
              <Display color="white" fontSize="48px">{t('cta_final.groups.corporate.price')}</Display>
              <Link href="/prices">
                <Button
                  backgroundColor="#2B8C4D"
                  color="#FFFFFF"
                  _hover={{ backgroundColor: "#22703E" }}
                  height="64px"
                  padding="0 48px"
                >
                  <LabelText typography="x-large">{t('cta_final.button')}</LabelText>
                </Button>
              </Link>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}

function FAQ({ t }) {
  return (
    <VStack width="100%" maxWidth="800px" margin="0 auto" padding="80px 24px" spacing={8}>
      <TitleText typography="large">{t('faq.title')}</TitleText>
      <Accordion allowMultiple width="100%">
        {[1, 2,3,4].map((i) => (
          <AccordionItem key={i} border="none" marginBottom={4}>
            <AccordionButton padding="16px" _hover={{ bg: 'gray.50' }}>
              <Box flex="1" textAlign="left">
                <TitleText typography="small">{t(`faq.q${i}`)}</TitleText>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <BodyText>{t(`faq.a${i}`)}</BodyText>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </VStack>
  );
}

export default function BDProPage() {
  const { t } = useTranslation('bdpro');

  return (
    <MainPageTemplate>
      <Hero t={t} />
      <Presentation t={t} />
      <Testimonials t={t} />
      <CTAFinal t={t} />
      <FAQ t={t} />
    </MainPageTemplate>
  );
}
