import {
  VStack,
  Stack,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Grid,
  GridItem,
  Image,
  Text
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { isMobileMod } from "../../hooks/useCheckMobile.hook";

import BigTitle from "../../components/atoms/BigTitle";
import Link from "../../components/atoms/Link";
import GreenTab from "../../components/atoms/GreenTab";
import ReadMore from "../../components/atoms/ReadMore";
import HelpWidget from "../../components/atoms/HelpWidget";
import DatasetResource from "../../components/organisms/DatasetResource";
import { MainPageTemplate } from "../../components/templates/main";

import FourOFour from "../../components/templates/404";
import { DataBaseIcon } from "../../public/img/icons/databaseIcon";

import {
  getListDatasets,
  getShowDataset,
} from "../api/datasets/index";

import { withPages } from "../../hooks/pages.hook";

export async function getStaticProps(context) {
  const dataset = await getShowDataset(context.params.dataset) || null

  return await withPages({
    props: {
      dataset,
    },
    revalidate: 30,
  })
}

export async function getStaticPaths(context) {
  const datasets = await getListDatasets()

  return {
    paths: datasets.map((res) => ({
      params: { dataset: res }
    })),
    fallback: "blocking"
  }
}

export default function DatasetPage ({ dataset }) {
  const router = useRouter()
  const { query } = router
  const [tabIndex, setTabIndex] = useState(0)

  const isDatasetEmpty = dataset === null || Object.keys(dataset).length === 0

  useEffect(() => {
    if(isDatasetEmpty) return router.push(`${process.env.NEXT_PUBLIC_API_URL}/dataset_redirect?dataset=${query.dataset}`)
  }, [])

  if(isDatasetEmpty) return <MainPageTemplate userTemplate><FourOFour/></MainPageTemplate>

  return (
    <MainPageTemplate userTemplate>
      <Head>
        <title>{dataset.name} – Base dos Dados</title>

        <link
          rel="image_src"
          href="https://storage.googleapis.com/basedosdados-website/thumbnails/2022/thumbnail_conjunto.png"
        />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/basedosdados-website/thumbnails/2022/thumbnail_conjunto.png"
          key="ogimage"
        />
        <meta
          name="twitter:image"
          content="https://storage.googleapis.com/basedosdados-website/thumbnails/2022/thumbnail_conjunto.png"
          key="twimage"
        />
        <meta
          property="og:title"
          content={`${dataset.name} – Base dos Dados`}
          key="ogtitle"
        />
        <meta property="og:description" content={dataset.description} key="ogdesc" />
      </Head>

      <VStack
        maxWidth="1440px"
        marginX="auto"
        boxSizing="content-box"
        padding="24px"
        overflow="auto"
      >
        <Grid
          templateColumns="300px 1fr"
          gap="24px"
        >
          <GridItem>
            <Image
              src={dataset?.organization?.picture.startsWith("https://") ? dataset?.organization?.picture : `https://basedosdados.org/uploads/group/${image}`}
              objectFit="cover"
            />
          </GridItem>
          
          <GridItem>
            <Grid
              templateColumns="1fr 1fr"
              gap="16px"
            >
              <GridItem colSpan={2}>
                <BigTitle
                  width="100%"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  fontFamily="Roboto"
                  fontWeight="500"
                  lineHeight="42px"
                >
                  {dataset.name || "Conjunto sem nome"}
                </BigTitle>
              </GridItem>

              <GridItem colSpan={2}>
                <ReadMore>
                  {dataset?.description || "Nenhuma descrição fornecida."}
                </ReadMore>
              </GridItem>

              <GridItem>
                <Text
                  fontFamily="Roboto"
                  fontWeight="500"
                  fontSize="18px"
                  lineHeight="28px"
                  color="#252A32"
                  marginBottom="8px"
                >
                  Cobertura temporal do conjunto
                </Text>
                <Text
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#464A51"
                >
                  {dataset.coverage || "Nenhuma cobertura temporal fornecida."}
                </Text>
              </GridItem>

              <GridItem>
                <Text
                  fontFamily="Roboto"
                  fontWeight="500"
                  fontSize="18px"
                  lineHeight="28px"
                  color="#252A32"
                  marginBottom="8px"
                >
                  Organização
                </Text>
                <Link href={`/dataset?organization=${dataset?.organization?.slug || ""}`}>
                  <Text
                    fontFamily="Roboto"
                    fontWeight="400"
                    fontSize="14px"
                    lineHeight="20px"
                    color="#464A51"
                  >
                    {dataset?.organization?.name || "Nenhuma organização fornecida."}
                  </Text>
                </Link>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>

        <Tabs
          display={"none"}
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

            {dataset?.slug === "br_ibge_ipca" && <GreenTab>Painéis</GreenTab>}
          </TabList>
          <TabPanels>
            <TabPanel padding="0px">
              <DatasetResource
                dataset={dataset}
              />
            </TabPanel>

            {dataset?.slug === "br_ibge_ipca" &&
              <TabPanel padding="0px">
                {/* <DashboardsPage
                  dataset={dataset}
                  availableOptionsTranslations={availableOptionsTranslations}
                /> */}
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

      <Stack display={query?.hasOwnProperty("table") !== "none"}>
        <script key="sql" src="/vendor/prism.js"/>
        <link rel="stylesheet" href="/vendor/prism.css" data-noprefix />
      </Stack>
    </MainPageTemplate>
  )
}