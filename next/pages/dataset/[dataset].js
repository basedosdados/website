import {
  VStack,
  Stack,
  HStack,
  Image,
  Flex,
  Tabs,
  TabList,
  Tab,
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
import { CategoryIcon } from "../../components/atoms/CategoryIcon";
import BigTitle from "../../components/atoms/BigTitle";
import { FilterAccordion } from "../../components/atoms/FilterAccordion";
import { useContext, useState } from "react";
import { isBdPlus, unionArrays } from "../../utils";
import Link from "../../components/atoms/Link";
import { SimpleButton } from "../../components/atoms/SimpleButton";
import { Markdown } from "../../components/atoms/Markdown";
import {
  getAvailableOptionsTranslations,
  getTranslations,
} from "../api/translations";
import { ExternalLinkPage } from "../../components/organisms/ExternalLinkPage";
import { BdmTablePage } from "../../components/organisms/BdmTablePage";
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

  return await withPages({
    props: {
      dataset,
      bdmTables,
      externalLinks,
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
        Criar link externo
      </SimpleButton>
    </>
  );
}

function ResourcesPage({
  bdmTables,
  externalLinks,
  availableOptionsTranslations,
  translations,
  dataset,
}) {
  const [resource, setResource] = useState(
    bdmTables.length > 0 ? bdmTables[0] : externalLinks[0]
  );

  const [bdmTableFilter, setBdmTableFilter] = useState(
    resource?.resource_type === "bdm_table"
  );

  const [externalLinkTableFilter, setExternalLinkTableFilter] = useState(
    resource?.resource_type === "external_link"
  );

  function getResourcePage() {
    switch (resource?.resource_type) {
      case "bdm_table":
        return (
          <BdmTablePage
            availableOptionsTranslations={availableOptionsTranslations}
            translations={translations["bdm_table"]}
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

      case "create_external_link":
        return (
          <BaseResourcePage
            title="Criar link externo"
            forceForm
            formComponent={
              <SchemaForm
                schemaName="Link externo"
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
      >
        <AdminButtons resource={resource} setResource={setResource} />
        {bdmTables.length > 0 ? (
          <FilterAccordion
            alwaysOpen={true}
            choices={bdmTables}
            value={resource.name}
            valueField="name"
            displayField="name"
            isActive={resource.resource_type === "bdm_table"}
            isOpen={bdmTableFilter}
            fieldName="Tabelas tratadas"
            bdPlus={true}
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
            isActive={resource.resource_type === "external_link"}
            isOpen={externalLinkTableFilter}
            fieldName="Links externos"
            value={resource.url}
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
      </VStack>
      <VStack width="100%" flex="1">
        {getResourcePage()}
      </VStack>
    </Stack>
  );
}

export default function DatasetPage({
  dataset,
  bdmTables,
  externalLinks,
  pages,
  isPlus,
  translations,
  availableOptionsTranslations,
}) {
  function getTemporalCoverage() {
    const temporalCoverage = unionArrays(
      dataset.resources
        .filter((r) => r?.temporal_coverage?.length)
        .map((r) => r.temporal_coverage)
    ).sort();

    if (temporalCoverage.length === 0 || !temporalCoverage) return "";
    if (temporalCoverage.length === 1) return temporalCoverage[0];

    return (
      temporalCoverage[0] +
      " - " +
      temporalCoverage[temporalCoverage.length - 1]
    );
  }

  return (
    <MainPageTemplate pages={pages}>
      <Head>
        <title>{dataset.title} - Base dos Dados</title>

        {/* Open Graph */}
        <link
          rel="image_src"
          href="https://basedosdados-static.s3.us-east-2.amazonaws.com/thumbnails/thumbnail_conjunto.png"
        />
        <meta
          property="og:image"
          content="https://basedosdados-static.s3.us-east-2.amazonaws.com/thumbnails/thumbnail_conjunto.png"
          key="ogimage"
        />
        <meta
          name="twitter:image"
          content="https://basedosdados-static.s3.us-east-2.amazonaws.com/thumbnails/thumbnail_conjunto.png"
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
          spacing={10}
          align="flex-start"
        >
          <Image
            borderRadius="31.8889px"
            boxShadow="0px 0px 10px rgba(0,0,0,0.25)"
            width={{ base: "50vw", lg: "16vw" }}
            height={{ base: "50vw", lg: "16vw" }}
            borderRadius="31px"
            objectFit="contain"
            src={
              "https://basedosdados.org/uploads/group/" +
              dataset.organization.image_url
            }
          />
          <VStack spacing={0} align="flex-start">
            <BigTitle
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              fontSize="28px"
              w={{ base: "90vw", lg: "70vw" }}
              color="black"
            >
              {dataset.title || "Conjunto sem nome"}
            </BigTitle>
            <Markdown width={{ base: "90vw", lg: "60vw" }} limit={true}>
              {dataset.notes || "Conjunto sem descrição"}
            </Markdown>

            <VStack align="flex-start" spacing={3} pt="15px">
              <VStack align="flex-start">
                <Title fontSize="16px">Organização</Title>
                <Link
                  href={`/dataset?organization=${dataset.organization.name}`}
                >
                  <SectionText fontWeight="400" fontSize="14px">
                    {dataset.organization.title}
                  </SectionText>
                </Link>
              </VStack>

              <VStack align="flex-start">
                <Title fontSize="16px">Cobertura Temporal</Title>
                <SectionText fontWeight="400" fontSize="14px">
                  {getTemporalCoverage()}
                </SectionText>
              </VStack>
            </VStack>
          </VStack>
        </Stack>

        <Tabs isLazy pt="20px" w={{ base: "90vw", lg: "100%" }}>
          <TabList padding="0px" border="0px" fontFamily="Ubuntu !important">
            <GreenTab>Recursos</GreenTab>
            <GreenTab>Metadados</GreenTab>
            <GreenTab>Perguntas</GreenTab>
          </TabList>
          <TabPanels>
            <TabPanel padding="0px">
              <ResourcesPage
                bdmTables={bdmTables}
                externalLinks={externalLinks}
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
            <TabPanel padding="0px">
              <DashboardsPage
                dataset={dataset}
                availableOptionsTranslations={availableOptionsTrasnslations}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </MainPageTemplate>
  );
}
