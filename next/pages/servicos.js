import {
  Stack,
  VStack,
  Image,
  Box,
  Skeleton
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ImageNext from "next/image";
import Head from "next/head";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CaseStudiesPaged } from "../content/caseStudies";
import Display from "../components/atoms/Display";
import BodyText from "../components/atoms/BodyText";
import Link from "../components/atoms/Link";
import RoundedButton from "../components/atoms/RoundedButton";
import SectionText from "../components/atoms/SectionText";
import SectionTitle from "../components/atoms/SectionTitle";
import { MainPageTemplate } from "../components/templates/main";
import { withPages } from "../hooks/pages.hook";
import { isMobileMod, useCheckMobile } from "../hooks/useCheckMobile.hook";
import BDLogoLabImage from "../public/img/logos/bd_logo_lab"

import CheckIcon from "../public/img/icons/checkIcon";


export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'services', 'menu'])),
      ...(await withPages()),
    },
  };
}

function FixedBottomBar() {
  const { t } = useTranslation('services');

  return (
    <Stack
      position="fixed"
      bottom="0px"
      width="100%"
      padding="10px 20px"
      height={isMobileMod() ? "90px" : "70px"}
      backgroundColor="#3AA1EB"
      justify="center"
      align="center"
      spacing={10}
      boxShadow="0px 2px 10px 2px rgba(0, 0, 0, 0.15)"
      zIndex="100"
      direction={{ base: "row", lg: "column" }}
    >
      <SectionText fontWeight="500" fontFamily="Ubuntu" color="white">
        {t('fixedBottomBar.text')}
      </SectionText>
      <Link
        position={{ base: "initial", lg: "fixed" }}
        bottom="14px"
        right="20%"
        href="/contato"
        textDecoration="none !important"
      >
        <RoundedButton
          _hover={{
            backgroundColor: "white",
            color: "#3AA1EB",
          }}
          color="#3AA1EB"
          backgroundColor="white"
        >
          {t('fixedBottomBar.buttonText')}
        </RoundedButton>
      </Link>
    </Stack>
  )
}

function Slogan () {
  const { t } = useTranslation('services');

  return (
    <Stack
      width="100%"
      maxWidth="950px"
      paddingTop="80px"
      spacing={0}
      margin={isMobileMod() ? "0 auto 60px" :"0 auto 100px"}
      alignItems="center"
    >
      <BDLogoLabImage
        widthImage={isMobileMod() ? "120px" : "240px"}
        heightImage={isMobileMod() ? "30px" : "60px"}
        marginBottom={isMobileMod() ? "24px" : "40px"}
      />
      <Display
        fontSize={isMobileMod() ? "34px" : "90px"}
        letterSpacing={isMobileMod() ? "-0.4px" : "-2.25px"}
        lineHeight={isMobileMod() ? "44px" : "108px"}
        textAlign="center"
        margin="0 0 24px !important"
      > 
        {t('slogan.title')}
      </Display>
      <BodyText
        fontWeight="400"
        fontSize={isMobileMod() ? "18px" : "28px"}
        lineHeight={isMobileMod() ? "24px" : "44px"}
        letterSpacing={isMobileMod() ? "0.1px" : "-0.1px"}
        textAlign="center"
      >
        {t('slogan.description')}
      </BodyText>
      <Link
        href="/contato-consultoria"
      >
        <Box
          as="p"
          target="_self"
          display="flex"
          alignItems="center"
          height="56px"
          width="fit-content"
          borderRadius="8px"
          backgroundColor="#0D99FC"
          padding="10px 16px"
          cursor="pointer"
          color="#FFF"
          fontFamily="Ubuntu"
          fontWeight="700"
          fontSize="20px"
          lineHeight="23px"
          letterSpacing="0.1px"
          marginTop="24px !important"
          _hover={{
            backgroundColor: "#0B89E2"
          }}
        >
          {t('slogan.cta')}
        </Box>
      </Link>
    </Stack>
  )
}

function BoxBenefits ({ benefits, children }) {
  return (
    <Stack flexDirection={benefits ? isMobileMod() ? "column" : "row" : "row"} spacing={0} gap="10px">
      <Box display="flex" flexDirection="row" justifyContent="center">
        <CheckIcon 
          width="28px"
          height="28px"
          fill="#2B8C4D"
        />
        {benefits && <BodyText fontWeight="500">{benefits}:</BodyText>}
      </Box>
      <BodyText>{children}</BodyText>
    </Stack>
  )
}

function BorderBox({ title, children }) {
  return (
    <VStack
      textAlign="center"
      borderRadius="18px"
      padding="25px"
      boxShadow="0 2px 16px 0 rgba(100, 96, 103, 0.16)"
      width="350px"
      height="230px"
      spacing={4}
    >
      <SectionTitle fontSize="16px">{title}</SectionTitle>
      <SectionText fontWeight="300" fontSize="14px" textAlign="center">
        {children}
      </SectionText>
    </VStack>
  )
}

function WorkflowBox({ order, title, subtitle, children}) {
  const hasLeftSpacing = (order % 2 == 0) ? false : true

  return (
    <VStack
      maxWidth="620px"
      textAlign="center"
      borderRadius="18px"
      padding="25px"
      boxShadow="0 2px 16px 0 rgba(100, 96, 103, 0.16)"
      margin={
        isMobileMod() ? "40px 0 0 0 !important" :
        hasLeftSpacing ?
          "40px auto 0 250px !important"
        : 
          "40px 250px 0 auto !important"
      }
      spacing={0}
    >
      <SectionTitle fontSize="20px" fontWeight="500" color="#2B8C4D">{title}</SectionTitle>
      <SectionTitle fontSize="16px" fontWeight="500">{subtitle}</SectionTitle>
      <SectionText fontWeight="300" fontSize="14px" textAlign="center">
        {children}
      </SectionText>
    </VStack>
  )
}

function CaseStudies ({}) {
  const { t } = useTranslation('services');
  const [CaseStudiesPages, setCaseStudiesPages] = useState([])

  useEffect(() => {
    setCaseStudiesPages(CaseStudiesPaged())
  },[])

  return (
    <Stack
      id="Estudos de caso"
      width="100%"
      maxWidth="1264px"
      paddingTop="100px"
      margin="0 auto !important"
      spacing={0}
    >
      <Display
        fontSize={useCheckMobile() ? "34px" : "60px"}
        letterSpacing={useCheckMobile() ? "-0.4px" : "-1.5px"}
        lineHeight={useCheckMobile() ? "44px" : "72px"}
        textAlign="center"
        marginBottom={useCheckMobile() ? "8px" : "16px"}
      >
        {t('caseStudies.title')}
      </Display>
      <SectionTitle
        color="#575757"
        textAlign="center"
        marginBottom={useCheckMobile() ? "80px !important" : "112px !important"}
        lineHeight={useCheckMobile() ? "32px" : "40px"}
      >
        {t('caseStudies.subtitle')}
      </SectionTitle>

      <Stack
        flexWrap="wrap"
        flexDirection="row"
        gridGap="32px"
        spacing={0}
        justifyContent={useCheckMobile() && "center"}
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
              width={useCheckMobile() ? "100%" : "400px"}
              height="145px"
              overflow="hidden"
              borderRadius="16px"
              marginBottom="24px"
            >
              {elm?.img.length > 0 ?
                <ImageNext
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
                <ImageNext
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
              marginBottom="18px !important"
              minHeight="110px"
              maxHeight="110px"
              textAlign="justify"
              overflow="hidden"
            >
              {elm.resume.slice(0,useCheckMobile() ? 160 :178)+"..."}
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
              {t('caseStudies.readMore')}
            </Link>
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

export default function Services() {
  const { t } = useTranslation('services');

  const services = {
    [t('services.dataCapture')]: "https://storage.googleapis.com/basedosdados-website/images/cloud.png",
    [t('services.dataAnalysis')]: "https://storage.googleapis.com/basedosdados-website/images/bar.png",
    [t('services.dataConsulting')]: "https://storage.googleapis.com/basedosdados-website/images/lightbulb.png",
  }

  return (
    <MainPageTemplate>
      <Head>
        <title>{t('pageTitle')}</title>
        <meta
          property="og:title"
          content={t('metaTitle')}
          key="ogtitle"
        />
      </Head>

      <Stack
        spacing={0}
        paddingX="24px"
        margin="0 auto"
        alignItems="center"
      >
        <Slogan/>

        <Stack
          justifyContent="center"
          width="100%"
          maxWidth="1264px"
          margin="0 auto !important"
          alignItems="center"
          direction={{ base: "column", lg: "row" }}
          gap="120px"
        >
          {Object.entries(services).map(([k, v]) => (
            <Link href={`#${k}`} key={v}>
              <VStack justify="flex-end">
                <Image alt="" marginBottom="15px" height="100px" src={v} />
                <SectionText fontSize="20px" fontWeight="bold">
                  {k}
                </SectionText>
              </VStack>
            </Link>
          ))}
        </Stack>

        <CaseStudies />

        <VStack
          id="Captura de dados"
          width="100%"
          maxWidth="1264px"
          padding="100px 0 40px"
          margin="auto"
          textAlign="center"
          spacing={0}
        >
          <Display paddingBottom="24px" >
            {t('dataCapture.title')}
          </Display>

          <BodyText maxWidth="800px" paddingBottom="8px" fontWeight="500" marginTop="0">
            {t('dataCapture.description')}
          </BodyText>
          <BodyText maxWidth="800px">
            {t('dataCapture.longDescription')}
          </BodyText>

          <Stack paddingTop="40px">
            <BodyText fontWeight="700">{t('dataCapture.advantages.title')}</BodyText>
            <BoxBenefits benefits={t('dataCapture.advantages.speed')}>
              {t('dataCapture.advantages.speedDescription')}
            </BoxBenefits>
            <BoxBenefits benefits={t('dataCapture.advantages.scale')}>
              {t('dataCapture.advantages.scaleDescription')}
            </BoxBenefits>
            <BoxBenefits benefits={t('dataCapture.advantages.cost')}>
              {t('dataCapture.advantages.costDescription')}
            </BoxBenefits>
          </Stack>

          <Stack paddingTop="40px" spacing="40px">
            <BodyText fontWeight="700">{t('dataCapture.work.title')}</BodyText>

            <Stack
              justifyContent="space-between"
              width="100%"
              direction={{ base: "column", lg: "row" }}
              align="center"
            >
              <BorderBox title={t('dataCapture.work.technology.title')}>
                {t('dataCapture.work.technology.description')}
              </BorderBox>
              <BorderBox title={t('dataCapture.work.flexibility.title')}>
                {t('dataCapture.work.flexibility.description')}
              </BorderBox>
              <BorderBox title={t('dataCapture.work.frameworks.title')}>
                {t('dataCapture.work.frameworks.description')}
              </BorderBox>
            </Stack>
          </Stack>
        </VStack>

        <VStack
          id="Análise de dados"
          width="100%"
          maxWidth="1264px"
          padding="100px 0 40px"
          margin="auto"
          textAlign="center"
          spacing={0}
        >
          <Display paddingBottom="24px" >
            {t('dataAnalysis.title')}
          </Display>

          <BodyText maxWidth="900px" paddingBottom="8px" fontWeight="500" marginTop="0">
            {t('dataAnalysis.description')}
          </BodyText>
          <BodyText maxWidth="800px">
            {t('dataAnalysis.longDescription')}
          </BodyText>

          <Stack paddingTop="40px">
            <BodyText fontWeight="700">{t('dataAnalysis.examples.title')}</BodyText>
            <BoxBenefits>
              {t('dataAnalysis.examples.example1')}
            </BoxBenefits>
            <BoxBenefits>
              {t('dataAnalysis.examples.example2')}
            </BoxBenefits>
            <BoxBenefits>
              {t('dataAnalysis.examples.example3')}
            </BoxBenefits>
          </Stack>
        </VStack>

        <VStack
          id="Consultoria de dados"
          width="100%"
          maxWidth="1264px"
          padding="100px 0 40px"
          margin="auto"
          textAlign="center"
          spacing={0}
        >
          <Display paddingBottom="24px" >
            {t('dataConsulting.title')}
          </Display>

          <BodyText maxWidth="900px" paddingBottom="8px" fontWeight="500" marginTop="0">
            {t('dataConsulting.description')}
          </BodyText>
          <BodyText maxWidth="800px">
            {t('dataConsulting.longDescription')}
          </BodyText>

          <Stack paddingTop="40px">
            <BodyText fontWeight="700">{t('dataConsulting.advantages.title')}</BodyText>
            <BoxBenefits>
              {t('dataConsulting.advantages.advantage1')}
            </BoxBenefits>
            <BoxBenefits>
              {t('dataConsulting.advantages.advantage2')}
            </BoxBenefits>
            <BoxBenefits>
              {t('dataConsulting.advantages.advantage3')}
            </BoxBenefits>
          </Stack>

          <Stack paddingTop="40px" spacing="40px">
            <BodyText fontWeight="700">{t('dataConsulting.areas.title')}</BodyText>

            <Stack
              justifyContent="space-between"
              width="100%"
              direction={{ base: "column", lg: "row" }}
              align="center"
            >
              <BorderBox title={t('dataConsulting.areas.infrastructure.title')}>
                {t('dataConsulting.areas.infrastructure.description')}
              </BorderBox>
              <BorderBox title={t('dataConsulting.areas.analysis.title')}>
                {t('dataConsulting.areas.analysis.description')}
              </BorderBox>
              <BorderBox title={t('dataConsulting.areas.programming.title')}>
                {t('dataConsulting.areas.programming.description')}
              </BorderBox>
            </Stack>
          </Stack>
        </VStack>

        <VStack
          width="100%"
          maxWidth="1264px"
          margin="auto"
          padding="100px 0 40px"
          textAlign="center"
          spacing={0}
        >
          <Display paddingBottom="24px" >
            {t('workflow.title')}
          </Display>
          <BodyText maxWidth="800px">
            {t('workflow.description')}
          </BodyText>

          <Stack spacing={0} width="100%">
            <WorkflowBox order={1} title={t('workflow.steps.demand.title')} subtitle={t('workflow.steps.demand.subtitle')}>
              {t('workflow.steps.demand.description')}
            </WorkflowBox>

            <WorkflowBox order={2} title={t('workflow.steps.planning.title')} subtitle={t('workflow.steps.planning.subtitle')}>
              {t('workflow.steps.planning.description')}
            </WorkflowBox>

            <WorkflowBox order={3} title={t('workflow.steps.budget.title')} subtitle={t('workflow.steps.budget.subtitle')}>
              {t('workflow.steps.budget.description')}
            </WorkflowBox>

            <WorkflowBox order={4} title={t('workflow.steps.execution.title')} subtitle={t('workflow.steps.execution.subtitle')}>
              {t('workflow.steps.execution.description')}
            </WorkflowBox>
          </Stack>
        </VStack>
        
        <Link
          href="/contato-consultoria"
        >
          <Box
            as="p"
            target="_self"
            display="flex"
            alignItems="center"
            height="56px"
            width="fit-content"
            borderRadius="8px"
            backgroundColor="#0D99FC"
            padding="10px 16px"
            cursor="pointer"
            color="#FFF"
            fontFamily="Ubuntu"
            fontWeight="700"
            fontSize="20px"
            lineHeight="23px"
            letterSpacing="0.1px"
            marginTop="24px !important"
            _hover={{
              backgroundColor: "#0B89E2"
            }}
          >
            {t('slogan.cta')}
          </Box>
        </Link>
      </Stack>
    </MainPageTemplate>
  )
}
