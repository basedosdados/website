import {
  VStack,
  Stack,
  Center,
  Image,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import Head from "next/head";
import { MainPageTemplate } from "../../components/templates/main";
import { withPages } from "../../hooks/pages.hook";
import {
  createResource,
  listDatasets,
  showDataset,
  updateResource,
} from "../api/datasets";
import SectionText from "../../components/atoms/SectionText";
import Title from "../../components/atoms/Title";
import BigTitle from "../../components/atoms/BigTitle";
import { FilterAccordion } from "../../components/atoms/FilterAccordion";
import { useContext, useState, useEffect } from "react";
import { isBdPlus, unionArrays } from "../../utils";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import Link from "../../components/atoms/Link";
import { SimpleButton } from "../../components/atoms/SimpleButton";
import { Markdown } from "../../components/atoms/Markdown";
import {
  getAvailableOptionsTranslations,
  getTranslations,
} from "../api/translations";
import { ExternalLinkPage } from "../../components/organisms/ExternalLinkPage";
import { BdmTablePage } from "../../components/organisms/BdmTablePage";
import { InformationRequestPage } from "../../components/organisms/InformationRequestPage";
import { MetadataPage } from "../../components/organisms/MetadataPage";
import { DashboardsPage } from "../../components/organisms/DashboardsPage";
import UserContext from "../../context/user";
import { SchemaForm } from "../../components/molecules/SchemaForm";
import {
  getBdmTableSchema,
  getExternalLinkSchema,
  getInformationRequestSchema,
} from "../api/schemas";
import { BaseResourcePage } from "../../components/molecules/BaseResourcePage";
import GreenTab from "../../components/atoms/GreenTab";
import DataBaseIcon from "../../public/img/icons/databaseIcon";
import DocIcon from "../../public/img/icons/docIcon";

export async function getStaticProps(context) {
  const dataset = await showDataset(context.params.dataset);
  const translations = await getTranslations();
  const availableOptionsTranslations = await getAvailableOptionsTranslations();
  const resources = dataset?.resources || [];
  const bdmTables = resources.filter(
    (r) => r && r?.resource_type === "bdm_table"
  );
  const externalLinks = resources.filter(
    (r) => r && r?.resource_type === "external_link"
  );
  const informationRequest = resources.filter(
    (r) => r && r?.resource_type === "information_request"
  );

  return await withPages({
    props: {
      dataset,
      bdmTables,
      externalLinks,
      informationRequest,
      translations,
      availableOptionsTranslations,
      isPlus: isBdPlus(dataset),
    },
    revalidate: 1, //TODO: Increase this timer
  });
}

export async function getStaticPaths(context) {
  let datasets = await listDatasets();

  return {
    paths: datasets
      .filter((d) => d != "br-me-siconfi") // TODO: Fix the dataset and remove this line
      .map((d) => ({
        params: { dataset: d },
      })),
    fallback: "blocking",
  };
}

function AdminButtons({ resource, setResource }) {
  const userData = useContext(UserContext);

  if (!userData?.is_admin) return <></>;

  return (
    <>
      <SimpleButton
        isActive={resource?.resource_type === "create_bdm_table"}
        onClick={() => setResource({ resource_type: "create_bdm_table" })}
      >
        Criar tabela tratada
      </SimpleButton>
      <SimpleButton
        isActive={resource?.resource_type === "create_information_request"}
        onClick={() =>
          setResource({ resource_type: "create_information_request" })
        }
      >
        Criar pedido LAI
      </SimpleButton>
      <SimpleButton
        isActive={resource?.resource_type === "create_external_link"}
        onClick={() => setResource({ resource_type: "create_external_link" })}
      >
        Criar fonte original
      </SimpleButton>
    </>
  );
}

function ResourcesPage({
  bdmTables,
  externalLinks,
  informationRequest,
  availableOptionsTranslations,
  translations,
  dataset,
}) {
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  const [resource, setResource] = useState(
    bdmTables.length > 0 ? bdmTables[0] : externalLinks[0] || informationRequest[0]
  );

  const [bdmTableFilter, setBdmTableFilter] = useState(
    resource?.resource_type === "bdm_table"
  );

  const [externalLinkTableFilter, setExternalLinkTableFilter] = useState(
    resource?.resource_type === "external_link"
  );

  const [informationRequestFilter, setInformationRequestFilter] = useState(
    resource?.resource_type === "information_request"
  );

  function getResourcePage() {
    switch (resource?.resource_type) {
      case "bdm_table":
        return (
          <BdmTablePage
            availableOptionsTranslations={availableOptionsTranslations}
            translations={translations}
            datasetName={dataset.dataset_id}
            resource={resource}
          />
        );

      case "external_link":
        return (
          <ExternalLinkPage
            availableOptionsTranslations={availableOptionsTranslations}
            translations={translations["external_link"]}
            resource={resource}
          />
        );

      case "information_request":
        return (
          <InformationRequestPage
            availableOptionsTranslations={availableOptionsTranslations}
            translations={translations["information_request"]}
            resource={resource}
          />
        );

      case "create_bdm_table":
        return (
          <BaseResourcePage
            title="Criar tabela tratada"
            forceForm
            formComponent={
              <SchemaForm
                schemaName="Tabela tratada"
                loadSchemaFunction={getBdmTableSchema}
                prepareData={(d) => {
                  d.resource_type = "bdm_table";
                  return d;
                }}
                updateFunction={(data) => createResource(data, dataset.id)}
              />
            }
          />
        );

      case "create_external_link":
        return (
          <BaseResourcePage
            title="Criar fonte original"
            forceForm
            formComponent={
              <SchemaForm
                schemaName="Fonte original"
                loadSchemaFunction={getExternalLinkSchema}
                prepareData={(d) => {
                  d.resource_type = "external_link";
                  return d;
                }}
                updateFunction={(data) => createResource(data, dataset.id)}
              />
            }
          />
        );

      case "create_information_request":
      return (
        <BaseResourcePage
          title="Criar pedido LAI"
          forceForm
          formComponent={
            <SchemaForm
              schemaName="Pedido LAI"
              loadSchemaFunction={getInformationRequestSchema}
              prepareData={(d) => {
                d.resource_type = "information_request";
                return d;
              }}
              updateFunction={(data) => createResource(data, dataset.id)}
            />
          }
        />
      );
    }
  }

  return (
    <Stack
      paddingTop="20px"
      direction={{ base: "column", lg: "row" }}
      spacing={4}
      width="100%"
    >
      <VStack
        minWidth={{ base: "100%", lg: "250px" }}
        maxWidth={{ base: "100%", lg: "250px" }}
        spacing={5}
        align="flex-start"
        justify="flex-start"
        borderRight={!isMobileMod && "1px solid #DEDFE0"}
      >
        <AdminButtons resource={resource} setResource={setResource} />
        {bdmTables.length > 0 ? (
          <FilterAccordion
            alwaysOpen={true}
            choices={bdmTables}
            value={resource.name}
            valueField="name"
            displayField="name"
            isOpen={bdmTableFilter}
            fieldName="Tabelas tratadas"
            bdPlus={true}
            isHovering={false}
            onChange={(name) =>
              setResource(bdmTables.filter((b) => b.name === name)[0])
            }
            onToggle={() => setBdmTableFilter(!bdmTableFilter)}
          />
        ) : (
          <></>
        )}
        {externalLinks.length > 0 ? (
          <FilterAccordion
            alwaysOpen={true}
            choices={externalLinks}
            valueField="url"
            displayField="name"
            isOpen={externalLinkTableFilter}
            fieldName="Originais"
            value={resource.url}
            isHovering={false}
            onChange={(url) =>
              setResource(externalLinks.filter((b) => b.url === url)[0])
            }
            onToggle={() =>
              setExternalLinkTableFilter(!externalLinkTableFilter)
            }
          />
        ) : (
          <></>
        )}
        {informationRequest.length > 0 ? (
          <FilterAccordion
            alwaysOpen={true}
            choices={informationRequest}
            valueField="name"
            displayField="name"
            isOpen={informationRequestFilter}
            fieldName="Pedidos LAI"
            value={resource.name}
            isHovering={false}
            onChange={(name) =>
              setResource(informationRequest.filter((b) => b.name === name)[0])
            }
            onToggle={() =>
              setInformationRequestFilter(!informationRequestFilter)
            }
          />
        ) : (
          <></>
        )}
      </VStack>
      <VStack
        width="100%"
        overflow="hidden"
        marginLeft={{base:"0", lg: "32px !important", xl: "44px !important"}}
        alignItems="flex-start"
        flex="1"
      >
        {getResourcePage()}
      </VStack>
    </Stack>
  );
}

export default function DatasetPage({
  dataset,
  bdmTables,
  externalLinks,
  informationRequest,
  pages,
  isPlus,
  translations,
  availableOptionsTranslations,
}) {
  const [tabIndex, setTabIndex] = useState(0)

  function getTemporalCoverage() {
    const temporalCoverage = unionArrays(
      dataset.resources
        .filter((r) => r?.temporal_coverage?.length)
        .map((r) => r.temporal_coverage)
    ).sort();

    if (temporalCoverage.length === 0 || !temporalCoverage) return "";

    var years = [];
    for (let i = 0; i < temporalCoverage.length; i++) {
      var interval = temporalCoverage[i];
      if (interval.includes("(")) {
        var first = interval.substring(0, interval.indexOf('('));
        var last  = interval.substring(   interval.indexOf(')')+1);
        years.push(first);
        years.push(last);
      }
      else {
        years.push(interval);
      }

    }

    var years = years.sort();

    if (years.length === 1) return years[0];

    var min_date = years[0];
    var max_date = years[years.length-1];

    return (min_date + " - " + max_date);

  }

  return (
    <MainPageTemplate pages={pages}>
      <Head>
        <title>{dataset.title} - Base dos Dados</title>

        {/* Open Graph */}
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
          content={`Base dos Dados - ${dataset.title}`}
          key="ogtitle"
        />
        <meta property="og:description" content={dataset.notes} key="ogdesc" />
      </Head>
      <VStack
        paddingTop={{ base: "50px", lg: "0px" }}
        margin="auto"
        width={{ base: "90vw", lg: "80vw" }}
      >
        <Stack
          direction={{ base: "column", lg: "row" }}
          margin="auto"
          spacing={8}
          align="flex-start"
        >
          <Center
            paddingTop="10px"
            width="100%"
            minWidth="235px"
            height="100%"
          >
            <Image
              borderRadius="31.8889px"
              boxShadow="0px 0px 10px rgba(0,0,0,0.25)"
              width={{ base: "25%", lg: "100%" }}
              minWidth="250px"
              maxWidth="225px"
              height={{ base: "25%", lg: "100%" }}
              minHeight="250px"
              objectFit="contain"
              src={
                "https://basedosdados.org/uploads/group/" +
                dataset.organization.image_url
              }
            />
          </Center>
          <VStack spacing={0} align="flex-start" width="100%">
            <BigTitle
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              fontSize="28px"
              letterSpacing="0.5px"
              width={{ base: "90vw", lg: "60vw" }}
              color="black"
            >
              {dataset.title || "Conjunto sem nome"}
            </BigTitle>
            <Markdown
              width={{ base: "90vw", lg: "60vw" }}
              limit={true}
              styleText= {{
                fontSize:"16px",
                fontWeight:"300",
                letterSpacing:"0.5px"
              }}
            >
              {dataset.notes || "Conjunto sem descrição"}
            </Markdown>

            <VStack align="flex-start" spacing={4} paddingTop="20px">
              <VStack align="flex-start">
                <Title fontWeigth="400" fontSize="18px">Organização</Title>
                <Link
                  marginTop="3px !important"
                  href={`/dataset?organization=${dataset.organization.name}`}
                >
                  <SectionText letterSpacing="0.5px" fontWeight="300" fontSize="16px">
                    {dataset.organization.title}
                  </SectionText>
                </Link>
              </VStack>

              <VStack align="flex-start">
                <Title fontWeight="400" fontSize="18px">Cobertura Temporal</Title>
                <SectionText letterSpacing="0.5px" marginTop="3px !important" fontWeight="300" fontSize="16px">
                  {getTemporalCoverage()}
                </SectionText>
              </VStack>
            </VStack>
          </VStack>
        </Stack>

        <Tabs
          onChange={(index) => setTabIndex(index)}
          isLazy
          paddingTop="20px"
          width={{ base: "90vw", lg: "100%" }}
        >
          <TabList
            padding="0px"
            fontFamily="Ubuntu !important"
            borderBottom= "2px solid #DEDFE0 !important"
          >
            <GreenTab>
              <DataBaseIcon
                widthIcon="22px"
                heightIcon="22px"
                marginRight="6px"
                fill={tabIndex === 0 ? "#2B8C4D" :"#C4C4C4"}
              />
              Dados
            </GreenTab>
            <GreenTab>
              <DocIcon
                widthIcon="22px"
                heightIcon="22px"
                marginRight="6px"
                fill={tabIndex === 1 ? "#2B8C4D" :"#C4C4C4"}
              />
              Metadados
            </GreenTab>
            {dataset.id === "br-ibge-ipca" && <GreenTab>Painéis</GreenTab>}
          </TabList>
          <TabPanels>
            <TabPanel padding="0px">
              <ResourcesPage
                bdmTables={bdmTables}
                externalLinks={externalLinks}
                informationRequest={informationRequest}
                availableOptionsTranslations={availableOptionsTranslations}
                translations={translations}
                dataset={dataset}
              />
            </TabPanel>
            <TabPanel padding="0px" pt="20px">
              <MetadataPage
                dataset={dataset}
                translations={translations}
                availableOptionsTranslations={availableOptionsTranslations}
              />
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
    </MainPageTemplate>
  );
}
