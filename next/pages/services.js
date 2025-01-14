import {
  Stack,
  VStack,
  Image,
  Box,
  Skeleton,
  Text,
  Grid,
  GridItem
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ImageNext from "next/image";
import Head from "next/head";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCheckMobile } from "../hooks/useCheckMobile.hook";
import { withPages } from "../hooks/pages.hook";
import { MainPageTemplate } from "../components/templates/main";

import {
  getAllCaseStudies
} from "./api/caseStudies"

import Link from "../components/atoms/Link";

import BDLogoLabImage from "../public/img/logos/bd_logo_lab"
import CheckIcon from "../public/img/icons/checkIcon";


export async function getStaticProps({ locale }) {
  const caseStudiesContent = await getAllCaseStudies(locale)

  return {
    props: {
      caseStudiesContent,
      ...(await serverSideTranslations(locale, ['common', 'services', 'menu'])),
      ...(await withPages()),
    },
  };
}

function Slogan () {
  const { t } = useTranslation('services');

  return (
    <Stack
      width="100%"
      maxWidth="950px"
      paddingTop="80px"
      spacing={0}
      margin={{base: "0 auto 60px", lg: "0 auto 100px"}}
      alignItems="center"
    >
      <BDLogoLabImage
        widthImage={{base: "120px", lg: "240px"}}
        heightImage={{base: "30px", lg: "60px"}}
        marginBottom={{base: "24px", lg: "40px"}}
      />
      <Text
        color="#252A32"
        fontFamily="Roboto"
        fontSize="60px"
        lineHeight="70px"
        fontWeight="500"
        textAlign="center"
        margin="0 0 24px !important"
      > 
        {t('slogan.title')}
      </Text>
      <Text
        color="#71757A"
        fontFamily="Roboto"
        fontSize="28px"
        lineHeight="42px"
        fontWeight="500"
        textAlign="center"
      >
        {t('slogan.description')}
      </Text>
      <Link
        href="/contact-consulting"
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
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="20px"
          lineHeight="30px"
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
    <Stack
      flexDirection={benefits ? {base: "column", lg: "row"} : "row"}
      spacing={0}
      alignItems="center"
      gap="10px"
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <CheckIcon 
          width="28px"
          height="28px"
          fill="#2B8C4D"
        />
        {benefits && 
          <Text 
            fontFamily="Roboto"
            fontSize="18px"
            lineHeight="26px"
            fontWeight="500"
            color="#464A51"
          >
            {benefits}:
          </Text>}
      </Box>
      <Text
        fontFamily="Roboto"
        fontSize="18px"
        lineHeight="26px"
        fontWeight="400"
        color="#464A51"
      >{children}</Text>
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
      height="100%"
      spacing={4}
    >
      <Text
        fontFamily="Roboto"
        fontSize="18px"
        lineHeight="28px"
        fontWeight="500"
        color="#252A32"
      >
        {title}
      </Text>
      <Text
        fontFamily="Roboto"
        fontSize="18px"
        lineHeight="26px"
        fontWeight="400"
        color="#464A51"
        textAlign="center"
      >
        {children}
      </Text>
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
      margin={{
        base: "40px 0 0 0 !important",
        lg: hasLeftSpacing ?
          "40px auto 0 250px !important"
        : 
          "40px 250px 0 auto !important"
      }}
      spacing={0}
    >
      <Text
        fontFamily="Roboto"
        color="#252A32"
        fontSize="18px"
        lineHeight="28px"
        fontWeight="500"
        textAlign="center"
      >
          {title}
      </Text>
      <Text
        fontFamily="Roboto"
        color="#71757A"
        fontSize="18px"
        lineHeight="28px"
        fontWeight="500"
        textAlign="center"
        paddingBottom="16px"
      >
          {subtitle}
      </Text>
      <Text
        fontFamily="Roboto"
        color="#464A51"
        fontSize="16px"
        lineHeight="24px"
        fontWeight="400"
        textAlign="center"
      >
        {children}
      </Text>
    </VStack>
  )
}

function CaseStudies ({ data }) {
  const { t } = useTranslation('services');
  const [CaseStudiesPages, setCaseStudiesPages] = useState([])

  useEffect(() => {
    setCaseStudiesPages(data)
  },[data])

  return (
    <Stack
      display={CaseStudiesPages.length === 0 ? "none" : "flex"}
      id="case-studies"
      width="100%"
      maxWidth="1440px"
      paddingTop="100px"
      margin="0 auto !important"
      spacing={0}
    >
      <Text
        fontFamily="Roboto"
        color="#252A32"
        fontSize="36px"
        lineHeight="48px"
        fontWeight="500"
        textAlign="center"
        paddingBottom="16px"
      >
        {t('caseStudies.title')}
      </Text>
      <Text
        fontFamily="Roboto"
        color="#71757A"
        fontSize="24px"
        lineHeight="36px"
        fontWeight="500"
        textAlign="center"
        paddingBottom="40px"
      >
        {t('caseStudies.subtitle')}
      </Text>

      <Stack
        flexWrap="wrap"
        flexDirection="row"
        gap="32px"
        spacing={0}
        justifyContent={{base: "center", lg: "start"}}
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
              width={{base: "100%", lg: "400px"}}
              height="145px"
              overflow="hidden"
              borderRadius="16px"
              marginBottom="24px"
            >
              {elm?.img ?
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
              {elm?.logo?.img ?
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

            <Text
              marginBottom="8px !important"
              minHeight="110px"
              maxHeight="110px"
              textAlign="justify"
              overflow="hidden"
              fontFamily="Roboto"
              color="#464A51"
              fontSize="18px"
              lineHeight="26px"
              fontWeight="400"
            >
              {elm?.summary && elm?.summary.slice(0,useCheckMobile() ? 160 :178)+"..."}
            </Text>

            <Link
              target="_self"
              href={`/case-studies/${elm.id}`}
              color="#0068C5"
              _hover={{color: "#0057A4"}}
              fontSize="18px"
              lineHeight="26px"
              fontWeight="400"
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

export default function Services({ caseStudiesContent }) {
  const { t } = useTranslation('services');

  const services = {
    [t('services.dataCapture')]: "https://storage.googleapis.com/basedosdados-website/images/cloud.png",
    [t('services.dataAnalysis')]: "https://storage.googleapis.com/basedosdados-website/images/bar.png",
    [t('services.dataConsulting')]: "https://storage.googleapis.com/basedosdados-website/images/lightbulb.png",
  }

  const service_ids = {
    [t('services.dataCapture')]: "data-capture",
    [t('services.dataAnalysis')]: "analytics",
    [t('services.dataConsulting')]: "consulting",
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
          maxWidth="1440px"
          margin="0 auto !important"
          alignItems="center"
          direction={{ base: "column", lg: "row" }}
          gap="120px"
        >
          {Object.entries(services).map(([k, v]) => (
            <Link href={`#${service_ids[k]}`} key={v}>
              <VStack justify="flex-end">
                <Image alt="" marginBottom="15px" height="100px" src={v} />
                <Text
                  fontFamily="Roboto"
                  fontSize="20px"
                  lineHeight="30px"
                  fontWeight="500"
                >
                  {k}
                </Text>
              </VStack>
            </Link>
          ))}
        </Stack>

        <CaseStudies data={caseStudiesContent}/>

        <VStack
          id="data-capture"
          width="100%"
          maxWidth="1440px"
          padding="100px 0 40px"
          margin="auto"
          textAlign="center"
          spacing={0}
        >
          <Text
            fontFamily="Roboto"
            color="#252A32"
            fontSize="50px"
            lineHeight="60px"
            fontWeight="500"
            textAlign="center"
            paddingBottom="8px"
          >
            {t('dataCapture.title')}
          </Text>

          <Text
            paddingBottom="24px"
            fontFamily="Roboto"
            fontSize="24px"
            lineHeight="32px"
            fontWeight="500"
            color="#252A32"
          >
            {t('dataCapture.description')}
          </Text>
          <Text
            maxWidth="800px"
            fontFamily="Roboto"
            fontSize="18px"
            lineHeight="26px"
            fontWeight="400"
            color="#464A51"
          >
            {t('dataCapture.longDescription')}
          </Text>

          <Stack paddingTop="40px">
            <Text
              fontFamily="Roboto"
              fontSize="18px"
              lineHeight="28px"
              fontWeight="500"
              color="#252A32"
            >
              {t('dataCapture.advantages.title')}
            </Text>

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
            <Text
              fontFamily="Roboto"
              fontSize="18px"
              lineHeight="28px"
              fontWeight="500"
              color="#252A32"
            >
              {t('dataCapture.work.title')}
            </Text>

            <Stack
              justifyContent="space-between"
              width="100%"
              direction={{ base: "column", lg: "row" }}
              align="center"
            >
              <Grid templateColumns={{base: "1fr", lg: "repeat(3, 1fr)"}} gap="8px">
                <GridItem>
                  <BorderBox title={t('dataCapture.work.technology.title')}>
                    {t('dataCapture.work.technology.description')}
                  </BorderBox>
                </GridItem>
                <GridItem>
                  <BorderBox title={t('dataCapture.work.flexibility.title')}>
                    {t('dataCapture.work.flexibility.description')}
                  </BorderBox>
                </GridItem>
                <GridItem>
                  <BorderBox title={t('dataCapture.work.frameworks.title')}>
                    {t('dataCapture.work.frameworks.description')}
                  </BorderBox>
                </GridItem>
              </Grid>
            </Stack>
          </Stack>
        </VStack>

        <VStack
          id="analytics"
          width="100%"
          maxWidth="1440px"
          padding="100px 0 40px"
          margin="auto"
          textAlign="center"
          spacing={0}
        >
          <Text
            fontFamily="Roboto"
            color="#252A32"
            fontSize="50px"
            lineHeight="60px"
            fontWeight="500"
            textAlign="center"
            paddingBottom="8px"
          >
            {t('dataAnalysis.title')}
          </Text>

          <Text
            paddingBottom="24px"
            fontFamily="Roboto"
            fontSize="24px"
            lineHeight="32px"
            fontWeight="500"
            color="#252A32"
          >
            {t('dataAnalysis.description')}
          </Text>
          <Text
            maxWidth="800px"
            fontFamily="Roboto"
            fontSize="18px"
            lineHeight="26px"
            fontWeight="400"
            color="#464A51"
          >
            {t('dataAnalysis.longDescription')}
          </Text>

          <Stack paddingTop="40px">
          <Text
              fontFamily="Roboto"
              fontSize="18px"
              lineHeight="28px"
              fontWeight="500"
              color="#252A32"
            >
              {t('dataAnalysis.examples.title')}
            </Text>

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
          id="consulting"
          width="100%"
          maxWidth="1440px"
          padding="100px 0 40px"
          margin="auto"
          textAlign="center"
          spacing={0}
        >
          <Text
            fontFamily="Roboto"
            color="#252A32"
            fontSize="50px"
            lineHeight="60px"
            fontWeight="500"
            textAlign="center"
            paddingBottom="8px"
          >
            {t('dataConsulting.title')}
          </Text>

          <Text
            paddingBottom="24px"
            fontFamily="Roboto"
            fontSize="24px"
            lineHeight="32px"
            fontWeight="500"
            color="#252A32"
          >
            {t('dataConsulting.description')}
          </Text>
          <Text
            maxWidth="800px"
            fontFamily="Roboto"
            fontSize="18px"
            lineHeight="26px"
            fontWeight="400"
            color="#464A51"
          >
            {t('dataConsulting.longDescription')}
          </Text>

          <Stack paddingTop="40px">
            <Text
              fontFamily="Roboto"
              fontSize="18px"
              lineHeight="28px"
              fontWeight="500"
              color="#252A32"
            >
              {t('dataConsulting.advantages.title')}
            </Text>

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
            <Text
              fontFamily="Roboto"
              fontSize="18px"
              lineHeight="28px"
              fontWeight="500"
              color="#252A32"
            >
              {t('dataConsulting.areas.title')}
            </Text>

            <Stack
              justifyContent="space-between"
              width="100%"
              direction={{ base: "column", lg: "row" }}
              align="center"
            >
              <Grid templateColumns={{base: "1fr", lg: "repeat(3, 1fr)"}} gap="8px">
                <GridItem>
                  <BorderBox title={t('dataConsulting.areas.infrastructure.title')}>
                    {t('dataConsulting.areas.infrastructure.description')}
                  </BorderBox>
                </GridItem>
                <GridItem>
                  <BorderBox title={t('dataConsulting.areas.analysis.title')}>
                    {t('dataConsulting.areas.analysis.description')}
                  </BorderBox>
                </GridItem>
                <GridItem>
                  <BorderBox title={t('dataConsulting.areas.programming.title')}>
                    {t('dataConsulting.areas.programming.description')}
                  </BorderBox>
                </GridItem>
              </Grid>
            </Stack>
          </Stack>
        </VStack>

        <VStack
          width="100%"
          maxWidth="1440px"
          margin="auto"
          padding="100px 0 40px"
          textAlign="center"
          spacing={0}
        >
          <Text
            fontFamily="Roboto"
            color="#252A32"
            fontSize="36px"
            lineHeight="48px"
            fontWeight="500"
            textAlign="center"
            paddingBottom="24px"
          >
            {t('workflow.title')}
          </Text>
          <Text
            maxWidth="800px"
            fontFamily="Roboto"
            color="#71757A"
            fontSize="24px"
            lineHeight="36px"
            fontWeight="500"
            textAlign="center"
          >
            {t('workflow.description')}
          </Text>

          <Stack spacing={0} width="100%" alignItems="center">
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
          href="/contact-consulting"
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
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="20px"
            lineHeight="30px"
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
