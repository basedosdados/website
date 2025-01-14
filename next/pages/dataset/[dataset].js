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
import { useRouter } from "next/router";
import Head from "next/head";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { capitalize } from 'lodash';

import GreenTab from "../../components/atoms/GreenTab";
import Link from '../../components/atoms/Link';
import ReadMore from "../../components/atoms/ReadMore";
import DatasetResource from "../../components/organisms/DatasetResource";
import DatasetUserGuide from "../../components/organisms/DatasetUserGuide";
import { MainPageTemplate } from "../../components/templates/main";

import FourOFour from "../../components/templates/404";
import { DataBaseIcon } from "../../public/img/icons/databaseIcon";
import BookIcon from "../../public/img/icons/bookIcon";
import CrossingIcon from "../../public/img/icons/crossingIcon";

import {
  getDataset,
  getListDatasets,
} from "../api/datasets/index";

import { getUserGuide, serializeUserGuide } from "../api/datasets/getUserGuide";

export async function getStaticProps(context) {
  const { locale, params } = context;
  let dataset = null;
  let contentUserGuide = null;
  let userGuide = null;

  try {
    dataset = await getDataset(params.dataset, locale || 'pt');
  } catch (error) {
    console.error("Fetch error:", error.message);
  }

  if(dataset?.usageGuide) {
    contentUserGuide = await getUserGuide(dataset.usageGuide, locale || 'pt');
  }

  try {
    userGuide = await serializeUserGuide(contentUserGuide);
  } catch (error) {
    userGuide = null;
  }

  const props = {
    ...(await serverSideTranslations(locale, ['dataset', 'common', 'menu', 'prices'])),
    dataset,
    userGuide,
  };
  
  return {
    props,
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

export default function DatasetPage ({ dataset, userGuide }) {
  const { t } = useTranslation('dataset', 'common');
  const router = useRouter()
  const { locale } = router

  const allowedURLs = ["https://basedosdados.org", "https://staging.basedosdados.org"]

  const isDatasetEmpty = !dataset || Object.keys(dataset).length === 0

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
        paddingX="24px"
        height="100%"
        spacing={0}
      >
        <Grid
          templateColumns={{ base: "1fr", lg: "295px 1fr" }}
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
              src={dataset?.organizations?.edges?.[0]?.node?.picture ? dataset?.organizations?.edges?.[0]?.node?.picture : `https://storage.googleapis.com/basedosdados-website/equipe/sem_foto.png`}
              objectFit="contain"
              width="295px"
              height="252px"
              borderRadius="16px"
            />
          </GridItem>

          <GridItem>
            <Grid
              templateColumns="1fr 1fr 1fr 1fr 1fr"
              gap="8px"
            >
              <GridItem colSpan={5}>
                <Text
                  width="100%"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace={{base: "inherit", lg:"nowrap"}}
                  fontFamily="Roboto"
                  fontWeight="500"
                  fontSize="28px"
                  lineHeight="42px"
                >
                  {dataset[`name${capitalize(locale)}`] || dataset.name || t('noName')}
                </Text>
              </GridItem>

              <GridItem colSpan={5} minHeight="60px" marginBottom="8px">
                <ReadMore id="readLessDataset">
                  {dataset[`description${capitalize(locale)}`] || dataset.description || t('noDescription')}
                </ReadMore>
              </GridItem>

              <GridItem colSpan={5} marginBottom="8px">
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
                  href={`/search?organization=${dataset?.organizations?.edges?.[0]?.node?.slug || ""}`}
                  color="#464A51"
                  fontWeight="400"
                >
                  <Text
                    fontFamily="Roboto"
                    fontSize="14px"
                    lineHeight="20px"
                  >
                    {dataset.organizations?.edges?.[0]?.node?.[`name${capitalize(locale)}`] || dataset.organizations?.edges?.[0]?.node?.name || t('noOrganization')}
                  </Text>
                </Link>
              </GridItem>

              <GridItem colSpan={{ base: 5, lg: 2 }} marginBottom="8px">
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

              {!allowedURLs.includes(process.env.NEXT_PUBLIC_BASE_URL_FRONTEND) &&
                <GridItem colSpan={{ base: 5, lg: 3 }} marginBottom="8px">
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
                    {dataset?.[`spatialCoverageName${capitalize(locale)}`]
                      ? Object.values(dataset[`spatialCoverageName${capitalize(locale)}`])
                          .sort((a, b) => a.localeCompare(b, locale))
                          .join(', ')
                      : t('notProvided')}
                  </Text>
                </GridItem>
              }
            </Grid>
          </GridItem>
        </Grid>

        <Tabs
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
                alt={t('dataAlt')}
                width="18px"
                height="18px"
                marginRight="6px"
              />
              {t('data')}
            </GreenTab>

            <GreenTab>
              <BookIcon
                alt={t('userGuideAlt')}
                width="24px"
                height="16px"
                marginRight="6px"
              />
              {t('userGuide')}
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
              <DatasetUserGuide
                data={userGuide}
                locale={locale}
                slug={dataset?.usageGuide}
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
