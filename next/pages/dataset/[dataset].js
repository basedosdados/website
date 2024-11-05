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
import axios from "axios";

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
  let spatialCoverageNames = [];

  try {
    dataset = await getDataset(params.dataset, locale || 'pt');
    
    if (dataset?.spatialCoverage) {
      const coverageArray = Array.isArray(dataset.spatialCoverage)
        ? dataset.spatialCoverage
        : typeof dataset.spatialCoverage === 'string'
          ? dataset.spatialCoverage.split(',').map(item => item.trim())
          : Object.values(dataset.spatialCoverage);

      const promises = coverageArray.map(slug => {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL_FRONTEND}/api/areas/getArea?slug=${slug}&locale=${locale}`;
        return axios.get(url).catch(error => {
          console.error(`Error fetching ${url}:`, error.message);
          return null;
        });
      });
      
      const responses = await Promise.all(promises);
      spatialCoverageNames = responses
        .filter(res => res !== null)
        .map(res => {
          const name = res.data.resource[0]?.node[`name${capitalize(locale)}`] || res.data.resource[0]?.node.name;
          return name;
        })
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, locale));
    }
  } catch (error) {
    console.error("Fetch error:", error.message);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['dataset', 'common', 'menu', 'prices'])),
      dataset,
      spatialCoverageNames,
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

export default function DatasetPage ({ dataset, spatialCoverageNames }) {
  const { t } = useTranslation('dataset', 'common');
  const router = useRouter()
  const { locale } = router
  const { query } = router
  const [tabIndex, setTabIndex] = useState(0)

  const isDatasetEmpty = dataset === null || Object.keys(dataset).length === 0

  if(isDatasetEmpty) return <MainPageTemplate userTemplate><FourOFour/></MainPageTemplate>

  return (
    <MainPageTemplate userTemplate footerTemplate="simple">
      <Head>
        <title>{`${dataset[`name${capitalize(locale)}`] || dataset.name} – ${t('dataBasis')}`}</title>

        <link
          rel="image_src"
          href={`https://storage.googleapis.com/basedosdados-website/thumbnails/${locale}/dataset.png`}
        />
        <meta
          property="og:image"
          content={`https://storage.googleapis.com/basedosdados-website/thumbnails/${locale}/dataset.png`}
          key="ogimage"
        />
        <meta
          name="twitter:image"
          content={`https://storage.googleapis.com/basedosdados-website/thumbnails/${locale}/dataset.png`}
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

              <Grid
                templateColumns={{ base: "1fr", lg: "minmax(250px, 1fr) minmax(250px, 1fr) minmax(250px, 1fr)" }}
                gap={{ base: "32px", lg: "48px" }}
                width="100%"
                marginTop="16px"
                maxWidth={{ lg: "1200px" }}
              >
                <GridItem>
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
                    {dataset.temporalCoverage || t('notProvided')}
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
                    {t('spatialCoverage')}
                  </Text>
                  <Text
                    fontFamily="Roboto"
                    fontWeight="400"
                    fontSize="14px"
                    lineHeight="20px"
                    color="#464A51"
                  >
                    {spatialCoverageNames.length > 0 
                      ? spatialCoverageNames.join(', ')
                      : t('notProvided')}
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
