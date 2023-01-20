import {
  VStack,
  Stack,
  Center,
  Tabs,
  TabList,
  TabPanel,
  TabPanels
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Head from "next/head";
import { isMobileMod } from "../../../hooks/useCheckMobile.hook";

import BigTitle from "../../../components/atoms/BigTitle";
import Subtitle from "../../../components/atoms/Subtitle";
import SectionText from "../../../components/atoms/SectionText";
import Link from "../../../components/atoms/Link";
import GreenTab from "../../../components/atoms/GreenTab";
import ReadMore from "../../../components/atoms/ReadMore";
import HelpWidget from "../../../components/atoms/HelpWidget";
import { ImageOrganization } from "../../../components/atoms/ImageOrganization";
import DatasetResource from "../../../components/organisms/DatasetResource";
import { MainPageTemplate } from "../../../components/templates/main";

import { DataBaseIcon } from "../../../public/img/icons/databaseIcon";
import DocIcon from "../../../public/img/icons/docIcon";
import CrossIcon from "../../../public/img/icons/crossIcon";

import {
  getListDatasets,
  getShowDataset,
  getOrganization,
  getInformationRequest
} from "../../api/new/datasets";
import { withPages } from "../../../hooks/pages.hook";

export async function getStaticProps(context) {
  const dataset = await getShowDataset(context.params.dataset)
  const organization = await getOrganization(dataset.organization)

  return await withPages({
    props: {
      dataset,
      organization
    },
    revalidate: 1,
  })
}

export async function getStaticPaths(context) {
  const datasets = await getListDatasets()

  return {
    paths: datasets.map((res) => ({
      params: { dataset: res.id }
    })),
    fallback: "blocking"
  }
}

export default function DatasetPage ({
  dataset,
  organization
}) {
  const [tabIndex, setTabIndex] = useState(0)

  return (
    <MainPageTemplate>
      <Head>
        <title>{dataset.name_pt} – Base dos Dados</title>

        <link
          rel="image_src"
          href="https://basedosdados-static.s3.us-east-2.amazonaws.com/thumbnails/2022/thumbnail_conjunto.png"
        />
        <meta
          property="og:image"
          content="https://basedosdados-static.s3.us-east-2.amazonaws.com/thumbnails/2022/thumbnail_conjunto.png"
          key="ogimage"
        />
        <meta
          name="twitter:image"
          content="https://basedosdados-static.s3.us-east-2.amazonaws.com/thumbnails/2022/thumbnail_conjunto.png"
          key="twimage"
        />
        <meta
          property="og:title"
          content={`${dataset.name_pt} – Base dos Dados`}
          key="ogtitle"
        />
        {/* <meta property="og:description" content={dataset.notes} key="ogdesc" /> */}
        <meta property="og:description" content="bbbbbbbbb" key="ogdesc" />
      </Head>

      <VStack
        paddingTop={{ base: "50px", lg: "0px" }}
        margin="auto"
        width={{ base: "90vw", lg: "80vw" }}
        maxWidth="1264px"
      >
        <Stack
          direction={{ base: "column", lg: "row" }}
          marginRight="auto"
          spacing={10}
          align="flex-start"
        >
          <Center
            paddingTop="4px"
            width="100%"
            minWidth="235px"
            height="100%"
          >
            <ImageOrganization/>
          </Center>

          <VStack spacing={0} align="flex-start" width="100%">
            <BigTitle
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              width={{ base: "90vw", lg: "60vw" }}
              maxWidth="970px"
              paddingBottom="8px"
            >
              {dataset.name_pt || "Conjunto sem nome"}
            </BigTitle>

            <ReadMore minHeight="70px" isMobileMod={isMobileMod()}>
              {dataset?.notes || "Nenhuma descrição fornecida."}
            </ReadMore>

            <VStack align="flex-start" spacing={5} paddingTop="20px">
              <VStack align="flex-start">
                <Subtitle>Organização</Subtitle>
                <Link
                  marginTop="4px !important"
                  href={`/dataset?organization=${organization.slug}`}
                >
                  <SectionText
                    fontSize={isMobileMod() ? "14px" : "16px"}
                  >
                    {organization.name_pt}
                  </SectionText>
                </Link>
              </VStack>

              <VStack align="flex-start">
                <Subtitle>Cobertura temporal</Subtitle>
                <SectionText
                  marginTop="4px !important"
                  fontSize={isMobileMod() ? "14px" : "16px"}
                >
                  {/*
                    importante prepara uma nova validacao para o temporalCoverage
                    {validateTemporalCoverage()}
                  */}
                </SectionText>
              </VStack>
            </VStack>
          </VStack>
        </Stack>

        <Tabs
          onChange={(index) => setTabIndex(index)}
          isLazy
          paddingTop="32px"
          width={{ base: "90vw", lg: "100%" }}
        >
          <TabList
            padding="0px"
            fontFamily="ubuntu !important"
            borderBottom= "2px solid #DEDFE0 !important"
          >
            <GreenTab>
              <DataBaseIcon
                alt="dados"
                width="22px"
                height="22px"
                marginRight="6px"
                fill={tabIndex === 0 ? "#2B8C4D" :"#C4C4C4"}
              />
              Dados
            </GreenTab>
            <GreenTab>
              <DocIcon
                alt="metadados"
                width="24px"
                height="24px"
                marginRight="6px"
                fill={tabIndex === 1 ? "#2B8C4D" :"#C4C4C4"}
              />
              Metadados
            </GreenTab>
            {dataset.id === "br-ibge-ipca" && <GreenTab>Painéis</GreenTab>}
          </TabList>
          <TabPanels>
            <TabPanel padding="0px">
              <DatasetResource
                dataset={dataset}
              />
            </TabPanel>

            <TabPanel padding="0px" pt="20px">

            </TabPanel>

            {dataset.id === "br-ibge-ipca" &&
              <TabPanel padding="0px">
                <DashboardsPage
                  dataset={dataset}
                  availableOptionsTranslations={availableOptionsTranslations}
                />
              </TabPanel>
            }
          </TabPanels>
        </Tabs>
      </VStack>

      <HelpWidget
        tooltip="Ajuda e recursos"
        options={[
          {name:"Perguntas frequentes", url: "/perguntas-frequentes"},
          {name:"Documentação", url: "https://basedosdados.github.io/mais/"},
          {name:"Vídeos no YouTube", url: "https://www.youtube.com/c/BasedosDados/featured"},
          {},
          {name:"Instale os nossos pacotes", url: "https://basedosdados.github.io/mais/access_data_packages/"},
          {},
          {name:"Como citar a BD?",  url: "/perguntas-frequentes/#reference"},
          {name:"O que são diretórios?", url: "/perguntas-frequentes/#directories"},
          {},
          {name:"Fale com nossa comunidade no Discord", url: "https://discord.gg/huKWpsVYx4"},
          {name:"Entre em contato", url: "/contato"},
        ]}
      />
      <link rel="stylesheet" href="/vendor/prism.css" data-noprefix />
    </MainPageTemplate>
  )
}