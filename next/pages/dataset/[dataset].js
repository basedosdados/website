import {
  VStack,
  Stack,
  HStack,
  Image,
  Button,
  Flex,
  Heading,
} from "@chakra-ui/react";
import Head from "next/head";
import { MainPageTemplate } from "../../components/templates/main";
import { withStrapiPages } from "../../hooks/strapi.hook";
import { listDatasets, showDataset } from "../api/datasets";
import SectionText from "../../components/atoms/SectionText";
import Title from "../../components/atoms/Title";
import { CategoryIcon } from "../../components/atoms/CategoryIcon";
import BigTitle from "../../components/atoms/BigTitle";
import { FilterAccordion } from "../../components/atoms/FilterAccordion";
import { useState } from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import { ExpandableTable } from "../../components/molecules/ExpandableTable";
import {
  filterOnlyValidValues,
  formatObjectsInArray,
  isBdPlus,
  translate,
} from "../../utils";
import Link from "../../components/atoms/Link";
import { SimpleButton } from "../../components/atoms/SimpleButton";
import { Markdown } from "../../components/atoms/Markdown";
import { getTranslations } from "../api/translations";

export async function getStaticProps(context) {
  const dataset = await showDataset(context.params.dataset);
  const translations = await getTranslations();
  const resources = dataset["resources"];
  const bdmTables = resources.filter((r) => r.resource_type === "bdm_table");
  const externalLinks = resources.filter(
    (r) => r.resource_type === "external_link"
  );

  return await withStrapiPages({
    props: {
      dataset,
      bdmTables,
      externalLinks,
      translations,
      isPlus: isBdPlus(dataset),
    },
    revalidate: 1, //TODO: Increase this timer
  });
}

export async function getStaticPaths(context) {
  let datasets = await listDatasets();

  return {
    paths: datasets.map((d) => ({
      params: { dataset: d },
    })),
    fallback: "blocking",
  };
}

function BaseResourcePage({
  title,
  buttonText,
  onClick,
  children,
  buttonRightIcon = <></>,
}) {
  return (
    <VStack
      width="100%"
      border="1px solid #DEDFE0"
      borderRadius="20px"
      padding="20px"
      alignItems="flex-start"
      spacing={7}
    >
      <Flex
        flexDirection={{ base: "column", lg: "row" }}
        width="100%"
        alignItems={{ base: "flex-start", lg: "flex-start" }}
      >
        <Title wordBreak="break-all">{title}</Title>
        {onClick ? (
          <Button
            colorScheme="blue"
            backgroundColor="#3AA1EB"
            marginLeft={{ base: null, lg: "auto" }}
            marginTop={{ base: "20px", lg: "0px" }}
            height="35px"
            borderRadius="13px"
            fontFamily="Lato"
            alignContent="center"
            justifyContent="center"
            letterSpacing="0.1em"
            boxShadow="0px 4px 4px 0px #00000040"
            rightIcon={buttonRightIcon}
            onClick={onClick}
          >
            {buttonText}
          </Button>
        ) : (
          <></>
        )}
      </Flex>
      {children}
    </VStack>
  );
}

function BdmTablePage({ translations, resource, datasetName }) {
  const [selectedConsultation, setSelectedConsultation] = useState("SQL");
  const consultationOptions = ["SQL", "Python", "R"];
  const queryName = `${resource.dataset_id}.${resource.name}`;

  const consultationLanguage = {
    SQL: "sql",
    Python: "python",
    R: "r",
  };

  const consultationText = {
    SQL: `SELECT * FROM \`basedosdados.${queryName}\` LIMIT 100`,
    Python: `import basedosdados as bd
# Para carregar o dado direto no pandas
df = bd.read_table(dataset_id='${resource.dataset_id}', 
        table_id='${resource.name}',
        billing_project_id=<YOUR_PROJECT_ID>)`,
    R: `install.packages("basedosdados")
library("basedosdados")
# Defina o seu projeto no Google Cloud
set_billing_id("<YOUR_PROJECT_ID>")
# Para carregar o dado direto no R
query <- "SELECT * FROM \`basedosdados.${queryName}\`"
df <- read_sql(query)`,
  };

  function getSizeLabel() {
    let size = Math.ceil(resource.bdm_file_size / 1000);

    if (size >= 1000) size = Math.ceil(size / 100) + " gb";
    else size = size + " mb";

    return `(${size})`;
  }

  return (
    <BaseResourcePage
      title={`${resource.name} ${resource.bdm_file_size ? getSizeLabel() : ""}`}
    >
      <VStack width="100%" spacing={3} alignItems="flex-start">
        <SectionText>
          <b>Descrição</b>
        </SectionText>
        <Markdown>
          {resource.description || "Nenhuma descrição fornecida."}
        </Markdown>
      </VStack>
      <VStack width="100%" spacing={3} alignItems="flex-start">
        <SectionText>
          <b>Coluna</b>
        </SectionText>
        <ExpandableTable
          headers={["nome", "descrição"]}
          values={resource.columns.map((c) => [c.name, c.description])}
        />
      </VStack>
      <VStack width="100%" spacing={3} alignItems="flex-start">
        <Title>Consulta aos dados</Title>
        <Stack width="100%" direction={{ base: "column", lg: "row" }}>
          {consultationOptions.map((c) => {
            const selected = c === selectedConsultation;
            return (
              <Button
                borderWidth={selected ? "3px" : "1px"}
                borderColor={selected ? "#3AA1EB" : "#DEDFE0"}
                fontSize="14px"
                fontFamily="Lato"
                color={selected ? "#3AA1EB" : "black"}
                height="35px"
                letterSpacing="0.1em"
                borderRadius="8px"
                minWidth="110px"
                backgroundColor="transparent"
                fontWeight={selected ? "bold" : "regular"}
                onClick={() => setSelectedConsultation(c)}
              >
                {c}
              </Button>
            );
          })}
          <Link
            target="_blank"
            href={`https://console.cloud.google.com/bigquery?p=basedosdados&d=${resource.dataset_id}&t=${resource.name}&page=table`}
          >
            <Button
              borderWidth={"1px"}
              borderColor={"#DEDFE0"}
              fontSize="14px"
              fontFamily="Lato"
              color={"black"}
              height="35px"
              letterSpacing="0.1em"
              borderRadius="8px"
              width={{ base: "100%", lg: "initial" }}
              minWidth="110px"
              backgroundColor="transparent"
              fontWeight={"regular"}
            >
              BigQuery
            </Button>
          </Link>
          <Link
            href={`https://storage.googleapis.com/basedosdados-public/one-click-download/${resource.dataset_id}/${resource.name}.zip`}
          >
            <Button
              borderWidth={"1px"}
              borderColor={"#DEDFE0"}
              fontSize="14px"
              fontFamily="Lato"
              color={"black"}
              height="35px"
              letterSpacing="0.1em"
              borderRadius="8px"
              width={{ base: "100%", lg: "initial" }}
              minWidth="110px"
              backgroundColor="transparent"
              fontWeight={"regular"}
            >
              Download
            </Button>
          </Link>
        </Stack>
        <Highlight
          code={consultationText[selectedConsultation]}
          language={consultationLanguage[selectedConsultation]}
          {...defaultProps}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={className}
              style={{
                ...style,
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                whiteSpace: "break-spaces",
                wordBreak: "break-all",
                backgroundColor: "#252A32",
              }}
            >
              {tokens.map((line, i) => (
                <div
                  style={{ wordBreak: "break-all" }}
                  {...getLineProps({ line, key: i })}
                >
                  {line.map((token, key) => (
                    <span
                      style={{ wordBreak: "break-all" }}
                      {...getTokenProps({ token, key })}
                    />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
        <SectionText fontSize="14px" fontWeight="500">
          Primeira vez usando {selectedConsultation}? <Link>Clique aqui</Link>{" "}
          para ver a documentação.{" "}
        </SectionText>
      </VStack>
      <VStack width="100%" spacing={3} alignItems="flex-start">
        <Title>Metadados da Tabela</Title>
        <ExpandableTable
          containerStyle={{ width: "100%", alignItems: "flex-start" }}
          headers={["nome", "valor"]}
          values={formatObjectsInArray(
            translate(
              translations,
              filterOnlyValidValues({ dataset_id: datasetName, ...resource }, [
                "dataset_id",
                "table_id",
                "spatial_coverage",
                "temporal_coverage",
                "update_frequency",
                "entity",
                "time_unit",
                "identifying_columns",
                "last_updated",
                "version",
                "published_by",
                "data_cleaned_by",
                "data_cleaning_description",
                "raw_files_url",
                "auxiliary_files_url",
                "architecture_url",
                "covered_by_dictionary",
                "partitions",
                "bdm_file_size",
                "columns",
              ])
            )
          )}
        />
      </VStack>
    </BaseResourcePage>
  );
}

function ExternalLinkPage({ translations, resource }) {
  return (
    <BaseResourcePage
      title={resource.name}
      buttonText="Acessar"
      buttonRightIcon={<Image src="/img/icons/white_right_arrow.svg" />}
      onClick={() => window.open(resource.url)}
    >
      <VStack width="100%" spacing={3} alignItems="flex-start">
        <Title>Metadados do Link Externo</Title>
        <ExpandableTable
          headers={["nome", "valor"]}
          values={formatObjectsInArray(
            translate(
              translations,
              filterOnlyValidValues(resource, [
                "title",
                "url",
                "description",
                "language",
                "has_structured_data",
                "has_api",
                "is_free",
                "requires_registration",
                "availability",
                "country_ip_address_required",
                "license",
                "spatial_coverage",
                "temporal_coverage",
                "update_frequency",
                "entity",
                "time_unit",
              ])
            )
          )}
        />
      </VStack>
    </BaseResourcePage>
  );
}

function MetadataPage({ translations, dataset }) {
  return (
    <BaseResourcePage title="Metadados do Conjunto">
      <ExpandableTable
        headers={["nome", "valor"]}
        values={formatObjectsInArray(
          translate(
            translations,
            filterOnlyValidValues(dataset, [
              "id",
              "groups",
              "tags",
              "spatial_coverage",
              "temporal_coverage",
              "update_frequency",
              "entity",
              "time_unit",
              "ckan_url",
              "github_url",
            ])
          )
        )}
      />
    </BaseResourcePage>
  );
}

export default function DatasetPage({
  dataset,
  bdmTables,
  externalLinks,
  strapiPages,
  isPlus,
  translations,
}) {
  const [resource, setResource] = useState(
    bdmTables.length > 0 ? bdmTables[0] : externalLinks[0]
  );

  const [bdmTableFilter, setBdmTableFilter] = useState(
    resource.resource_type === "bdm_table"
  );
  const [externalLinkTableFilter, setExternalLinkTableFilter] = useState(
    resource.resource_type === "external_link"
  );

  function getResourcePage() {
    switch (resource.resource_type) {
      case "bdm_table":
        return (
          <BdmTablePage
            translations={translations["bdm_table"]}
            datasetName={dataset.dataset_id}
            resource={resource}
          />
        );

      case "external_link":
        return (
          <ExternalLinkPage
            translations={translations["external_link"]}
            resource={resource}
          />
        );

      default:
        return (
          <MetadataPage
            translations={translations["dataset"]}
            dataset={dataset}
          />
        );
    }
  }

  return (
    <MainPageTemplate strapiPages={strapiPages}>
      <Head>
        <title>Base dos Dados - {dataset.title}</title>

        {/* Open Graph */}
        <meta
          property="og:title"
          content={`Base dos Dados - ${dataset.title}`}
          key="ogtitle"
        />
        <meta property="og:description" content={dataset.notes} key="ogdesc" />
      </Head>
      <Flex
        direction={{ base: "column", lg: "row" }}
        width={{ base: "90%", lg: "85%" }}
        margin="auto"
        spacing={10}
      >
        <VStack
          alignItems={{ base: "flex-start", lg: "flex-start" }}
          justifyContent="flex-start"
          width="220px"
        >
          <Image
            borderRadius="31.8889px"
            boxShadow="0px 0px 10px rgba(0,0,0,0.25)"
            minWidth="220px"
            minHeight="220px"
            maxWidth="220px"
            maxHeight="220px"
            borderRadius="31px"
            objectFit="contain"
            src={
              "https://basedosdados.org/uploads/group/" +
              dataset.organization.image_url
            }
          />
          <Stack
            paddingTop={{ base: "30px", lg: "20px" }}
            spacing={6}
            direction={{ base: "column", lg: "column" }}
          >
            <VStack alignItems="flex-start">
              <Title>Organização</Title>
              <Link href={`/dataset?organization=${dataset.organization.name}`}>
                <SectionText fontWeight="400" fontSize="14px">
                  {dataset.organization.title}
                </SectionText>
              </Link>
            </VStack>
            <VStack alignItems="flex-start">
              <Title paddingTop="">Temas</Title>
              {dataset.groups.map((g) => (
                <Link href={`/dataset?group=${g.name}`}>
                  <HStack key={g.name}>
                    <CategoryIcon
                      size="39px"
                      url={`/img/categories/icone_${g.name}${
                        isPlus ? "-1" : ""
                      }.svg`}
                    />
                    <SectionText>{g.display_name}</SectionText>
                  </HStack>
                </Link>
              ))}
            </VStack>
          </Stack>
        </VStack>
        <VStack
          paddingTop={{ base: "50px", lg: "0px" }}
          transform={{ base: "", lg: "translateX(50px)" }}
          alignItems="flex-start"
        >
          <BigTitle fontSize="30px" color="black">
            {dataset.title}
          </BigTitle>
          <Markdown>{dataset.notes}</Markdown>

          <Stack
            paddingTop="20px"
            direction={{ base: "column", lg: "row" }}
            spacing={4}
            width="100%"
          >
            <VStack
              minWidth={{ base: "100%", lg: "230px" }}
              maxWidth={{ base: "100%", lg: "230px" }}
              spacing={5}
              align="flex-start"
              justify="flex-start"
            >
              <BigTitle
                fontSize="18px"
                color="black"
                margin="0px"
                padding="0px"
                height="40px"
                paddingLeft="15px"
              >
                Recursos
              </BigTitle>
              <SimpleButton
                isActive={resource.resource_type === "metadata"}
                onClick={() => setResource({ resource_type: "metadata" })}
              >
                Metadados do Conjunto
              </SimpleButton>
              {bdmTables.length > 0 ? (
                <FilterAccordion
                  choices={bdmTables}
                  value={resource.name}
                  valueField="name"
                  displayField="name"
                  isActive={resource.resource_type === "bdm_table"}
                  isOpen={bdmTableFilter}
                  fieldName="Tabelas"
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
                  choices={externalLinks}
                  valueField="url"
                  displayField="name"
                  isActive={resource.resource_type === "external_link"}
                  isOpen={externalLinkTableFilter}
                  fieldName="Links Externos"
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
        </VStack>
      </Flex>
    </MainPageTemplate>
  );
}
