import React, { useState, useEffect } from "react";
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
  Tooltip,
} from "@chakra-ui/react";
import Head from "next/head";
import cookies from 'js-cookie';
import { useRouter } from 'next/router';
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
import Toggle from "../components/atoms/Toggle";
import BDLogoProImage from "../public/img/logos/bd_logo_pro";
import { isMobileMod } from "../hooks/useCheckMobile.hook";

import CheckIcon from "../public/img/icons/checkIcon";
import InfoIcon from '../public/img/icons/infoIcon';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu', 'bdpro', 'prices'])),
    },
    revalidate: 30
  };
}

const CardPrice = ({
  title,
  subTitle,
  price,
  anualPlan = false,
  textResource,
  resources = [],
  button,
  locale,
}) => {
  const { t } = useTranslation('prices');

  return (
    <Box
      display="flex"
      flexDirection="column"
      position="relative"
      width={{base: "100%", lg: "272px"}}
      boxSizing={{base: "inherit", lg: "content-box"}}
      borderRadius="16px"
      backgroundColor="#FFFFFF"
      boxShadow="0 2px 16px 0 rgba(100, 96, 103, 0.16)"
      padding="40px 24px"
      textAlign="center"
    >
      <Box height="fit-content">
        <Box
          display="flex"
          flexDirection="row"
          gap="8px"
          justifyContent="center"
          alignItems="center"
          marginBottom="8px"
        >
          <TitleText typography="large" textAlign="center">
            {title}
          </TitleText>
        </Box>

        <LabelText
          typography="large"
          fontWeight="400"
          textAlign="center"
          color="#71757A"
          marginBottom="24px"
        >
          {subTitle}
        </LabelText>

        <Box
          justifyContent="center"
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginBottom="40px"
        >
          <Box display="flex" flexDirection="row" height="60px" alignItems="center">
            <Display textAlign="center">R$ {anualPlan ? Math.ceil(price/12) : price}</Display>
            <TitleText
              typography="small"
              position="relative"
              top="16px"
              right="-4px"
              textAlign="center"
            >{t('perMonth')}</TitleText>
          </Box>

          <BodyText
            height="24px"
            color="#464A51"
            marginTop="24px"
            alignItems="center"
          >{anualPlan && t('annualBillingMessage', {
            price: price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
          })}</BodyText>
        </Box>
      </Box>

      <Box
        flex={1}
        textAlign="start"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box marginBottom="24px">
          <BodyText color="#71757A" alignItems="center" marginBottom="16px">
            {textResource}
          </BodyText>

          {resources.map((elm, i) => {
            return (
              <Box
                key={i}
                display="flex"
                marginBottom="8px"
                flexDirection="row"
                alignItems="center"
                gap="8px"
                _last={{marginBottom:"0px !important"}}
              >
                <CheckIcon width="24px" height="24px" fill="#2B8C4D" />
                <BodyText alignItems="center" color="#464A51">
                  {elm.name}
                </BodyText>
                {elm.tooltip &&
                  <Tooltip
                    label={elm.tooltip}
                    hasArrow
                    placement="top"
                    padding="16px"
                    backgroundColor="#252A32"
                    boxSizing="border-box"
                    borderRadius="8px"
                    fontFamily="Roboto"
                    fontWeight="400"
                    fontSize="14px"
                    lineHeight="20px"
                    textAlign="center"
                    color="#FFFFFF"
                    maxWidth="230px"
                  >
                    <Box display="inline-block">
                      <InfoIcon width="14px" height="14px" alt="tip" cursor="pointer" fill="#878A8E"/>
                    </Box>
                  </Tooltip>
                }
              </Box>
            )
          })}
        </Box>

        <Box display="flex" flexDirection="column" gap="16px">
          {button.isCurrentPlan ? (
            <LabelText
              typography="x-large"
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              height="40px"
              textAlign="center"
              color="#7D7D7D"
              cursor="default"
            >
              {t('currentPlan')}
            </LabelText>
          ) : (
            <Link
              href={button.onClick ? '#' : button.href}
              width="100%"
              style={{ textDecoration: 'none' }}
            >
              <Box
                id={button?.id}
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="100%"
                borderRadius="8px"
                backgroundColor="#2B8C4D"
                padding="12px 16px"
                cursor="pointer"
                color="#FFF"
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="20px"
                lineHeight="36px"
                onClick={button.onClick}
                _hover={{ backgroundColor: "#22703E" }}
              >
                {t(button.text)}
              </Box>
            </Link>
          )}

          <BodyText 
            display="flex"
            flexDirection="row"
            justifyContent="center"
            textAlign="center"
            color="#71757A"
            height="24px"
          >{t('readThe')}
            <Link href="/terms?section=terms" locale={locale} passHref>
              <BodyText
                as="span"
                cursor="pointer"
                marginLeft="4px"
                target="_blank"
                alignItems="center"
                color="#0068C5"
                _hover={{ color: "#0057A4" }}
              >
                {t('termsOfService')}
              </BodyText>
            </Link>
            .
          </BodyText>
        </Box>
      </Box>
    </Box>
  )
}

function SectionPrice() {
  const { t, ready } = useTranslation('prices');
  const { locale } = useRouter();
  const [toggleAnual, setToggleAnual] = useState(true)
  const [plans, setPlans] = useState(null)
  const [username, setUsername] = useState(null)
  const [isBDPro, setIsBDPro] = useState({isCurrentPlan: false})
  const [isBDEmp, setIsBDEmp] = useState({isCurrentPlan: false})
  const [hasSubscribed, setHasSubscribed] = useState(true)

  if (!ready) return null

  async function alreadySubscribed(id) {
    const result = await fetch(`/api/user/getAlreadySubscribed?p=${btoa(id)}`)
      .then(res => res.json())
    setHasSubscribed(result)
  } 

  useEffect(() => {
    let user = null
    if(cookies.get("userBD")) user = JSON.parse(cookies.get("userBD"))

    if(user) {
      const reg = new RegExp("(?<=:).*")
      const [ id ] = reg.exec(user.id)
      alreadySubscribed(id)
    } else {
      setHasSubscribed(false)
    }

    const stripeSubscription = {
      stripeSubscription: user?.proSubscription,
      planInterval: user?.internalSubscription?.edges?.[0]?.node?.planInterval || user?.subscriptionSet?.edges?.[0]?.node?.planInterval
    }

    if(user != null) {
      setUsername(user?.username)
      setIsBDPro({isCurrentPlan: stripeSubscription?.stripeSubscription === "bd_pro", planInterval: stripeSubscription?.planInterval})
      setIsBDEmp({isCurrentPlan: stripeSubscription?.stripeSubscription === "bd_pro_empresas", planInterval: stripeSubscription?.planInterval})
    }

    async function fecthPlans() {
      try {
        const result = await fetch(`/api/stripe/getPlans`, { method: "GET" })
          .then(res => res.json())

        if(result.success === true) {
          function filterData(productName, interval, isActive, amount) {
            let array = result.data

            return array.filter(item => 
              (productName ? item.node.productName === productName : true) &&
              (interval ? item.node.interval === interval : true) &&
              (amount ? item.node.amount === amount : true) &&
              (isActive !== undefined ? item.node.isActive === isActive : true)
            )
          }

          const filteredPlans = {
            bd_pro_month : filterData("BD Pro", "month", true, 47)[0].node,
            bd_pro_year : filterData("BD Pro", "year", true, 444)[0].node,
            bd_empresas_month : filterData("BD Empresas", "month", true, 385)[0].node,
            bd_empresas_year : filterData("BD Empresas", "year", true, 3700)[0].node
          }

          setPlans(filteredPlans)
        }
      } catch (error) {
        console.error(error)
      }
    }

    setToggleAnual(true)
    fecthPlans()
  }, [])

  function planIntervalPlan() {
    const planInterval = toggleAnual ? "year" : "month"
    if(isBDPro?.planInterval === planInterval) return true
    return false
  }

  const freeFeatures = t('plans.free.features', { returnObjects: true });
  const proFeatures = t('plans.pro.features', { returnObjects: true });
  const enterpriseFeatures = t('plans.enterprise.features', { returnObjects: true });

  return (
    <VStack spacing={10} width="100%" maxWidth="1200px">
      <HStack spacing={4} justifyContent="center" alignItems="center">
        <Toggle
          id="toggle-prices"
          defaultChecked
          value={toggleAnual}
          onChange={() => setToggleAnual(!toggleAnual)}
        />
        <LabelText typography="large" fontWeight="400" textAlign="center">
          {t('annualDiscount')}
          <LabelText
            typography="large"
            as="span"
            color="#2B8C4D"
            backgroundColor="#D5E8DB"
            padding="2px 8px"
            borderRadius="4px"
            marginLeft="8px"
          >{t('save20')}</LabelText>
        </LabelText>
      </HStack>

      <Stack
        direction={{ base: "column", lg: "row" }}
        spacing={6}
        justifyContent="center"
        alignItems={{ base: "center", lg: "stretch" }}
        width="100%"
      >
        <CardPrice
          title={t('plans.free.title')}
          subTitle={t('plans.free.subtitle')}
          price="0"
          textResource={t('features')}
          resources={(Array.isArray(freeFeatures) ? freeFeatures : []).map((feature, index) => ({
            name: feature,
            tooltip: index === 1 ? t('tooltips.integratedData') : (index === 6 ? t('tooltips.downloadLimit') : null)
          }))}
          button={{
            text: t('exploreFeatures'),
            href: "/search",
          }}
          locale={locale}
        />

        <CardPrice
          title={t('plans.pro.title')}
          subTitle={t('plans.pro.subtitle')}
          price={plans?.[`bd_pro_${toggleAnual ? "year" : "month"}`]?.amount || 444}
          anualPlan={toggleAnual}
          textResource={t('allFeaturesPlus', { plan: t('plans.free.title') })}
          resources={(Array.isArray(proFeatures) ? proFeatures : []).map((feature, index) => ({
            name: feature,
            tooltip: index === 2 ? t('tooltips.downloadLimitPro') : null
          }))}
          button={{
            text: isBDPro.isCurrentPlan && planIntervalPlan() ? t('currentPlan') : hasSubscribed ? t('subscribe') : t('startFreeTrial'),
            href: username === null ? `/user/login?i=${plans?.[`bd_pro_${toggleAnual ? "year" : "month"}`]?._id}` :`/user/${username}?plans_and_payment&i=${plans?.[`bd_pro_${toggleAnual ? "year" : "month"}`]?._id}`,
            isCurrentPlan: isBDPro.isCurrentPlan && planIntervalPlan(),
          }}
          locale={locale}
        />

        <CardPrice
          title={t('plans.enterprise.title')}
          subTitle={t('plans.enterprise.subtitle')}
          price={plans?.[`bd_empresas_${toggleAnual ? "year" : "month"}`]?.amount || 3700}
          anualPlan={toggleAnual}
          textResource={t('allFeaturesPlus', { plan: t('plans.pro.title') })}
          resources={(Array.isArray(enterpriseFeatures) ? enterpriseFeatures : []).map(feature => ({ name: feature }))}
          button={{
            text: isBDEmp.isCurrentPlan && planIntervalPlan() ? t('currentPlan') : hasSubscribed ? t('subscribe') : t('startFreeTrial'),
            href: username === null ? `/user/login?i=${plans?.[`bd_empresas_${toggleAnual ? "year" : "month"}`]?._id}` :`/user/${username}?plans_and_payment&i=${plans?.[`bd_empresas_${toggleAnual ? "year" : "month"}`]?._id}`,
            isCurrentPlan: isBDEmp.isCurrentPlan && planIntervalPlan(),
          }}
          locale={locale}
        />
      </Stack>
    </VStack>
  );
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
    { key: 'empregos', bottom: "-55%", right: "-230px"},
    { key: 'comex', top: "50%", left: "-320px", transform: "translateY(-50%)" },
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
      overflow="hidden"
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
  const tabs = [1, 2, 3, 4];

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
              <Box height="450px" bg="#F9F9F9" borderRadius="16px" display="flex" alignItems="center" justifyContent="center" border="1px dashed #DDD">
                <VStack spacing={4}>
                  <ChakraImage src={`/img/bdpro_demo_${i}.gif`} fallbackSrc="https://via.placeholder.com/800x450?text=GIF+Demonstrativo" borderRadius="8px" maxWidth="800px" width="100%" />
                  <BodyText color="#71757A">{t(`presentation.tabs.tab${i}.label`)}</BodyText>
                </VStack>
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
    <VStack width="100%" padding="80px 24px" backgroundColor="#F7F9FA" spacing={12}>
       <TitleText typography="large" textAlign="center">{t('testimonials.title')}</TitleText>
       <Box width="100%" maxWidth="850px" position="relative">
         <Carousel
           settings={{
             spaceBetween: 24,
             slidesPerView: 1,
             navigation: true,
             pagination: { clickable: true },
             autoplay: { delay: 6000 },
           }}
         >
           {testimonialKeys.map((key) => (
             <Box key={key} width="100%" display="flex" justifyContent="center" padding="10px">
               <Card
                  width="100%"
                  maxWidth="700px"
                  height="auto"
                  minHeight="350px"
                  padding={isMobile ? "30px" : "50px"}
               >
                  <VStack alignItems="flex-start" spacing={6} height="100%" width="100%" justifyContent="space-between">
                    <Box overflowY="auto" width="100%" flex="1" pr="8px">
                      <BodyText fontStyle="italic" fontSize={isMobile ? "16px" : "18px"} lineHeight="28px">
                        "{t(`testimonials.list.${key}.text`)}"
                      </BodyText>
                    </Box>
                    <Box width="100%">
                      <TitleText typography="small" fontSize="16px">{t(`testimonials.list.${key}.name`)}</TitleText>
                      <LabelText fontSize="14px">{t(`testimonials.list.${key}.role`)}</LabelText>
                    </Box>
                  </VStack>
               </Card>
             </Box>
           ))}
         </Carousel>
       </Box>
    </VStack>
  );
}

function PricingSection({ t }) {
  return (
    <VStack width="100%" padding="80px 24px" spacing={12} backgroundColor="#FAFAFA">
      <Display textAlign="center" maxWidth="800px">
        {t('prices:comparePlans')}
      </Display>
      <SectionPrice />
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
  const { t } = useTranslation(['bdpro', 'prices']);

  return (
    <MainPageTemplate>
      <Head>
        <title>BD Pro | Base dos Dados</title>
      </Head>
      <Hero t={t} />
      <Presentation t={t} />
      <Testimonials t={t} />
      <PricingSection t={t} />
      <FAQ t={t} />
    </MainPageTemplate>
  );
}
