import {
  VStack,
  Grid,
  GridItem,
  Image,
  Stack,
  useDisclosure
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { capitalize } from "lodash";
import cookies from "js-cookie";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

import TitleText from "../../components/atoms/Text/TitleText";
import LabelText from "../../components/atoms/Text/LabelText";
import BodyText from "../../components/atoms/Text/BodyText";
import Link from "../../components/atoms/Link";
import ReadMore from "../../components/atoms/ReadMore";
import DatasetResource from "../../components/organisms/DatasetResource";
import DatasetUserGuide from "../../components/organisms/DatasetUserGuide";
import { MainPageTemplate } from "../../components/templates/main";
import { ModalInitialTour, ModalSurveyTour, exploreTour } from "../../components/molecules/Tour";

import { DataBaseIcon } from "../../public/img/icons/databaseIcon";
import BookIcon from "../../public/img/icons/bookIcon";

import {
  getDataset,
  getListDatasets,
} from "../api/datasets/index";

import { getUserGuide, serializeUserGuide } from "../api/datasets/getUserGuide";

export async function getStaticProps(context) {
  const { locale, params } = context;
  let dataset = null;
  let userGuide = null;
  let hiddenDataset = false;

  try {
    dataset = await getDataset(params.dataset, locale || 'pt');
  } catch (error) {
    console.error("Fetch error:", error.message);
  }

  let contentUserGuide = dataset?.usageGuide ? await getUserGuide(dataset.usageGuide, locale || 'pt') : null;

  function checkStatus() {
    const statusesToCheck = ["under_review", "excluded"];
    const edgesToCheck = ["tables", "rawDataSources", "informationRequests"];

    if (dataset?.status?.slug && statusesToCheck.includes(dataset.status.slug)) return true;

    return edgesToCheck.some(edge => 
      dataset?.[edge]?.edges?.some(item => statusesToCheck.includes(item.node?.status?.slug))
    );
  }

  if (dataset?.status?.slug === "under_review" || dataset?.status?.slug === "excluded") {
    hiddenDataset = true;
  }

  try {
    userGuide = await serializeUserGuide(contentUserGuide);
  } catch (error) {
    userGuide = null;
  }

  const props = {
    ...(await serverSideTranslations(locale, ['dataset', 'common', 'menu', 'prices', 'tour'])),
    dataset: dataset || null,
    userGuide: userGuide || null,
    hiddenDataset,
    verifyBDSudo: checkStatus()
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

export default function DatasetPage ({ dataset, userGuide, hiddenDataset, verifyBDSudo }) {
  const { t } = useTranslation('dataset', 'common');
  const router = useRouter();
  const { locale, query } = router;
  const [tabIndex, setTabIndex] = useState(0);
  const [isBDSudo, setIsBDSudo] = useState(null);
  const [tourBegin, setTourBegin] = useState(false);
  const [exploreTourBegin, setExploreTourBegin] = useState(false);
  const modalTourInitial = useDisclosure();
  const modalSurveyTour = useDisclosure();

  const isDatasetEmpty = !dataset || Object.keys(dataset).length === 0

  useEffect(() => {
    const handleLoadingTourBegin = (e) => {
      modalSurveyTour.onOpen();
    };

    window.addEventListener('datasetSurveyTour', handleLoadingTourBegin);

    return () => {
      window.removeEventListener('datasetSurveyTour', handleLoadingTourBegin);
    }
  }, [])

  useEffect(() => {
    if(useCheckMobile()) cookies.set('tourBD', '{"state":"skip"}', { expires: 360 })
  }, [])

  useEffect(() => {
    if (isDatasetEmpty) {
      router.replace('/404');
    }

    const tourBD = cookies.get("tourBD") ? JSON.parse(cookies.get("tourBD")) : null;
    if(tourBD === null) modalTourInitial.onOpen()

    if(tourBD && tourBD.state === "explore") {
      const dataset_tables = dataset?.tables?.edges
        ?.map((elm) => elm.node)
          ?.filter(
            (elm) =>
              !["under_review", "excluded"].includes(elm?.status?.slug) &&
              !["dicionario", "dictionary"].includes(elm?.slug)
          )
            ?.sort(sortElements) || [];

      if (dataset_tables.length > 0) {
        exploreTour(datasetTab, setTabIndex, setTourBegin, query, locale);
      }
    }
  }, [isDatasetEmpty, router, exploreTourBegin]);

  async function checkBDSudo() {
    const userBD = cookies.get("userBD") ? JSON.parse(cookies.get("userBD")) : null;

    try {
      const responsePermission = await fetch("/api/user/getPermissionSudo");
      const hasPermission = await responsePermission.json();

      if (hasPermission?.isAdmin === true) {
        setIsBDSudo(true);
        return;
      }

      if (!hasPermission || hasPermission.email === "undefined" || (userBD && hasPermission.email === userBD.email)) {
        setIsBDSudo(false);
        return;
      }

      let newPermission = { isAdmin: false, email: "undefined" };

      if (userBD?.isAdmin) {
        const id = userBD.id.split(":").pop();
        if (id) {
          const response = await fetch(`/api/user/getUser?p=${btoa(id)}&q=${btoa(cookies.get("token"))}`, { method: "GET" });
          const userData = await response.json();
          newPermission.isAdmin = !!userData?.isAdmin;
          newPermission.email = userData?.email || "undefined";
        }
      }

      await fetch(`/api/user/setPermissionSudo?p=${btoa(String(newPermission.isAdmin))}&q=${btoa(newPermission.email)}`);
      setIsBDSudo(newPermission.isAdmin);
    } catch (error) {
      console.error("Erro ao verificar permissão sudo:", error);
      setIsBDSudo(false);
    }
  }

  useEffect(() => {
    if (verifyBDSudo) checkBDSudo();
  }, [verifyBDSudo])

  useEffect(() => {
    const userBD = cookies.get("userBD") ? JSON.parse(cookies.get("userBD")) : null;

    if (!userBD && hiddenDataset) {
      router.replace("/404", undefined, { shallow: true });
    }

    if (isBDSudo !== null && !isBDSudo && hiddenDataset) {
      router.replace("/404", undefined, { shallow: true });
    }
  }, [isBDSudo, hiddenDataset]);

  const pushQuery = (key, value) => {
    router.replace({
      pathname: `/dataset/${query.dataset}`,
      query: { [key]: value }
    },
      undefined, { shallow: true }
    )
  }

  function sortElements(a, b) {
    if (a.order < b.order) {
      return -1
    }
    if (a.order > b.order) {
      return 1
    }
    return 0
  }

  async function datasetTab() {
    let dataset_tables
    let raw_data_sources
    let information_request

    dataset_tables = dataset?.tables?.edges
      ?.map((elm) => elm.node)
        ?.filter(
          (elm) =>
            !["under_review", "excluded"].includes(elm?.status?.slug) &&
            !["dicionario", "dictionary"].includes(elm?.slug)
        )
          ?.sort(sortElements) || [];

    raw_data_sources = dataset?.rawDataSources?.edges
      ?.map((elm) => elm.node)
        ?.filter((elm) => !["under_review", "excluded"].includes(elm?.status?.slug))
          ?.sort(sortElements) || [];
  
    information_request = dataset?.informationRequests?.edges
      ?.map((elm) => elm.node)
        ?.filter((elm) => !["under_review", "excluded"].includes(elm?.status?.slug))
          ?.sort(sortElements) || [];

    if(dataset_tables.length > 0) return pushQuery("table", dataset_tables[0]?._id)
    if(raw_data_sources.length > 0) return pushQuery("raw_data_source", raw_data_sources[0]?._id)
    if(information_request.length > 0) return pushQuery("information_request", information_request[0]?._id)
  }

  useEffect(() => {
    if(!!query.tab) setTabIndex(1)
  }, [query.tab])

  const TabSelect = ({ index, onClick, children }) => {
    return (
      <LabelText
        typography="small"
        as="div"
        cursor="pointer"
        position="relative"
        top="1px"
        color={tabIndex === index ? "#2B8C4D" :"#71757A"}
        fill={tabIndex === index ? "#2B8C4D" :"#71757A"}
        pointerEvents={tabIndex === index ? "none" : "default"}
        borderBottom={tabIndex === index && "3px solid #2B8C4D"}
        padding="12px 24px 13px"
        _hover={{
          color: "#464A51",
          fill: "#464A51"
        }}
        onClick={onClick}
      >
        {children}
      </LabelText>
    )
  }

  if(isDatasetEmpty) return null

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
        <ModalInitialTour
          isOpen={modalTourInitial.isOpen}
          onClose={modalTourInitial.onClose}
          begin={setExploreTourBegin}
        />
        <ModalSurveyTour
          isOpen={modalSurveyTour.isOpen}
          onClose={modalSurveyTour.onClose}
        />

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
                <TitleText
                  typography="large"
                  width="100%"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace={{base: "inherit", lg:"nowrap"}}
                >
                  {dataset[`name${capitalize(locale)}`] || dataset.name || t('noName')}
                </TitleText>
              </GridItem>

              <GridItem colSpan={5} minHeight="60px" marginBottom="8px">
                <ReadMore id="readLessDataset">
                  {dataset[`description${capitalize(locale)}`] || dataset.description || t('noDescription')}
                </ReadMore>
              </GridItem>

              <GridItem colSpan={5} marginBottom="8px">
                <LabelText
                  typography="large"
                  marginBottom="8px"
                >
                  {t('organization')}
                </LabelText>
                <Link
                  href={`/search?organization=${dataset?.organizations?.edges?.[0]?.node?.slug || ""}`}
                >
                  <BodyText
                    typography="small"
                    color="#464A51"
                  >
                    {dataset.organizations?.edges?.[0]?.node?.[`name${capitalize(locale)}`] || dataset.organizations?.edges?.[0]?.node?.name || t('noOrganization')}
                  </BodyText>
                </Link>
              </GridItem>

              <GridItem colSpan={{ base: 5, lg: 2 }} marginBottom="8px">
                <LabelText
                  typography="large"
                  marginBottom="8px"
                >
                  {t('temporalCoverage')}
                </LabelText>
                <BodyText
                  typography="small"
                  color="#464A51"
                >
                  {dataset.temporalCoverage || t('notProvided')}
                </BodyText>
              </GridItem>

              {locale !== 'pt' ?
                <GridItem colSpan={{ base: 5, lg: 3 }} marginBottom="8px">
                  <LabelText
                    typography="large"
                    marginBottom="8px"
                  >
                    {t('spatialCoverage')}
                  </LabelText>
                  <BodyText
                    typography="small"
                    color="#464A51"
                  >
                    {dataset?.[`spatialCoverageName${capitalize(locale)}`]
                      ? Object.values(dataset[`spatialCoverageName${capitalize(locale)}`])
                          .sort((a, b) => a.localeCompare(b, locale))
                          .join(', ')
                      : t('notProvided')}
                  </BodyText>
                </GridItem>
                :
                <></>
              }
            </Grid>
          </GridItem>
        </Grid>

        <Stack spacing={0} width="100%" height="100%">
          <Stack spacing={0} flexDirection="row" borderBottom="1px solid #DEDFE0">
            <Stack id="tab_database_dataset">
              <TabSelect
                index={0}
                onClick={() => {
                  setTabIndex(0)
                  datasetTab()
                }}
              >
                <DataBaseIcon
                  alt={t('dataAlt')}
                  width="18px"
                  height="18px"
                  marginRight="6px"
                />
                {t('data')}
              </TabSelect>
            </Stack>

            <TabSelect
              index={1}
              onClick={() => {
                setTabIndex(1)
                router.replace({
                  pathname: `/dataset/${query.dataset}`,
                  query: { tab: "userGuide" }
                },
                  undefined, { shallow: true }
                )
              }}
            >
              <BookIcon
                alt={t('userGuideAlt')}
                width="24px"
                height="16px"
                marginRight="6px"
              />
              {t('userGuide')}
            </TabSelect>
          </Stack>

          {tabIndex === 0 &&
            <DatasetResource
              dataset={dataset}
              isBDSudo={isBDSudo}
              tourBegin={tourBegin}
            />
          }
          {tabIndex === 1 &&
            <DatasetUserGuide
              data={userGuide}
              locale={locale}
              slug={dataset?.usageGuide}
            />
          }
        </Stack>
      </VStack>
    </MainPageTemplate>
  )
}
