import {
  VStack,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Grid,
  GridItem,
  Image,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { capitalize } from 'lodash';

import BigTitle from "../../components/atoms/BigTitle";
import GreenTab from "../../components/atoms/GreenTab";
import Link from '../../components/atoms/Link';
import ReadMore from "../../components/atoms/ReadMore";
import DatasetResource from "../../components/organisms/DatasetResource";
import { MainPageTemplate } from "../../components/templates/main";

import FourOFour from "../../components/templates/404";
import { DataBaseIcon } from "../../public/img/icons/databaseIcon";
import CrossingIcon from "../../public/img/icons/crossingIcon";

import {
  getDataset,
  getListDatasets,
} from "../api/datasets/index";

export async function getStaticProps(context) {
  const { locale, params } = context;
  let dataset = null;
  try {
    dataset = await getDataset(params.dataset, locale || 'pt');
  } catch (error) {
    console.error("Fetch error:", error.message);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['dataset', 'common', 'menu'])),
      dataset,
    },
    revalidate: 30,
  };
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
  const { t } = useTranslation('dataset', 'common');
  const router = useRouter()
  const { locale } = router
  const { query } = router
  const [tabIndex, setTabIndex] = useState(0)

  const isDatasetEmpty = dataset === null || Object.keys(dataset).length === 0

  useEffect(() => {
    if (router.query?.dataset === "mundo-kaggle-olimpiadas") return window.open(`${process.env.NEXT_PUBLIC_BASE_URL_FRONTEND}/dataset/62f8cb83-ac37-48be-874b-b94dd92d3e2b`, "_self")
    if (isDatasetEmpty) return router.push(`${process.env.NEXT_PUBLIC_API_URL}/dataset_redirect?dataset=${query.dataset}`)
  }, [])

  if(isDatasetEmpty) return <MainPageTemplate userTemplate><FourOFour/></MainPageTemplate>

  return (
    <MainPageTemplate userTemplate footerTemplate="simple">
      <Head>
        <title>{`${dataset[`name${capitalize(locale)}`] || dataset.name} – ${t('dataBasis')}`}</title>

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
          content={`${dataset[`name${capitalize(locale)}`] || dataset.name} – ${t('dataBasis')}`}
          key="ogtitle"
        />
        <meta
          property="og:description"
          content={dataset[`description${capitalize(locale)}`] || dataset.description}
          key="ogdesc"
        />
      </Head>

      <VStack
        maxWidth="1440px"
        marginX="auto"
        boxSizing="content-box"
        overflow="auto"
        paddingX="24px"
        spacing={0}
      >
        <Grid
          templateColumns={{ base: "1fr", lg: "296px 1fr" }}
          width="100%"
          gap="24px"
          paddingY="24px"
        >
          <GridItem
            display="flex"
            height="fit-content"
            justifyContent="center"
            border="1px solid #DEDFE0"
            borderRadius="16px"
          >
            <Image
              src={dataset?.organization?.picture ? dataset?.organization?.picture : `https://storage.googleapis.com/basedosdados-website/equipe/sem_foto.png`}
              objectFit="contain"
              width="300px"
              height="182px"
              borderRadius="16px"
            />
          </GridItem>

          <GridItem>
            <Grid
              templateColumns="1fr 1fr"
              gap="8px"
            >
              <GridItem colSpan={2}>
                <BigTitle
                  width="100%"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace={{base: "inherit", lg:"nowrap"}}
                  fontFamily="Roboto"
                  fontWeight="500"
                  lineHeight="42px"
                >
                  {dataset[`name${capitalize(locale)}`] || dataset.name || t('noName')}
                </BigTitle>
              </GridItem>

              <GridItem colSpan={2} minHeight="60px" marginBottom="8px">
                <ReadMore id="readLessDataset">
                  {dataset[`description${capitalize(locale)}`] || dataset.description || t('noDescription')}
                </ReadMore>
              </GridItem>

              <GridItem colSpan={{ base: 2, lg: 1 }}>
                <Text
                  fontFamily="Roboto"
                  fontWeight="500"
                  fontSize="18px"
                  lineHeight="28px"
                  color="#252A32"
                  marginBottom="8px"
                >
                  {t('temporalCoverage')}
                </Text>
                <Text
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#464A51"
                >
                  {dataset.coverage || t('noCoverage')}
                </Text>
              </GridItem>

              <GridItem colSpan={{ base: 2, lg: 1 }}>
                <Text
                  fontFamily="Roboto"
                  fontWeight="500"
                  fontSize="18px"
                  lineHeight="28px"
                  color="#252A32"
                  marginBottom="8px"
                >
                  {t('organization')}
                </Text>
                <Link
                  href={`/search?organization=${dataset?.organization?.slug || ""}`}
                  color="#464A51"
                  fontWeight="400"
                >
                  <Text
                    fontFamily="Roboto"
                    fontSize="14px"
                    lineHeight="20px"
                  >
                    {dataset.organization?.[`name${capitalize(locale)}`] || dataset.organization?.name || t('noOrganization')}
                  </Text>
                </Link>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>

        <Tabs
          onChange={(index) => setTabIndex(index)}
          variant="unstyled"
          isLazy
          width="100%"
        >
          <TabList
            padding="0px"
            borderBottom="1px solid #DEDFE0 !important"
          >
            <GreenTab>
              <DataBaseIcon
                alt="dados"
                width="18px"
                height="18px"
                marginRight="6px"
              />
              {t('data')}
            </GreenTab>

            <GreenTab display="none">
              <CrossingIcon
                alt="cruzamento"
                width="28px"
                height="24px"
                marginRight="2px"
              />
              {t('crossing')}
            </GreenTab>
          </TabList>

          <TabPanels>
            <TabPanel padding="0px">
              <DatasetResource
                dataset={dataset}
              />
            </TabPanel>

            <TabPanel padding="0px">
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </MainPageTemplate>
  )
}
