import {
  VStack,
  Box,
  Stack,
  HStack,
  Image,
  Button,
  Flex,
} from "@chakra-ui/react";
import { MainPageTemplate } from "../../components/templates/main";
import { withStrapiPages } from "../../hooks/strapi.hook";
import { listDatasets, showDataset } from "../api/datasets";
import SectionTitle from "../../components/atoms/SectionTitle";
import SectionText from "../../components/atoms/SectionText";
import Title from "../../components/atoms/Title";
import { CategoryIcon } from "../../components/atoms/CategoryIcon";
import BigTitle from "../../components/atoms/BigTitle";
import {
  CheckboxFilterAccordion,
  FilterAccordion,
} from "../../components/atoms/FilterAccordion";
import { useState } from "react";
import { SimpleTable } from "../../components/atoms/SimpleTable";
import Highlight, { defaultProps } from "prism-react-renderer";

export async function getStaticProps(context) {
  const dataset = await showDataset(context.params.dataset);
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
      isPlus: dataset.download_type === "BD Mais",
    },
    revalidate: 30, //TODO: Increase this timer
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

function BaseResourcePage({ title, buttonText, onClick, children }) {
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
        alignItems={{ base: "flex-start", lg: "center" }}
      >
        <Title>{title}</Title>
        {onClick ? (
          <Button
            colorScheme="blue"
            backgroundColor="#3AA1EB"
            marginLeft={{ base: null, lg: "auto" }}
            marginTop={{ base: "20px", lg: null }}
            height="35px"
            borderRadius="13px"
            letterSpacing="0.1em"
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

function BdmTablePage({ resource, datasetName }) {
  const [selectedConsultation, setSelectedConsultation] = useState("BigQuery");
  const consultationOptions = ["BigQuery", "Python", "R"];
  const queryName = `${datasetName}.${resource.name}`;

  const consultationLanguage = {
    BigQuery: "sql",
    Python: "python",
    R: "r",
  };

  const consultationText = {
    BigQuery: `SELECT * FROM \`basedosdados.${queryName}\` LIMIT 100`,
    Python: `import basedosdados as bd
# Para carregar o dado direto no pandas
df = bd.read_table(dataset_id='${datasetName}', 
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

  return (
    <BaseResourcePage
      title={resource.name}
      buttonText="Download"
      onClick={() => {}}
    >
      <VStack width="100%" spacing={3} alignItems="flex-start">
        <SectionText>
          <b>Descrição</b>
        </SectionText>
        <SectionText wordBreak="break-word" fontWeight="400" fontSize="14px">
          {resource.description || "Nenhuma descrição fornecida."}
        </SectionText>
      </VStack>
      <VStack spacing={3} alignItems="flex-start">
        <SectionText>
          <b>Coluna</b>
        </SectionText>
        <SimpleTable
          headers={["nome", "descrição"]}
          values={resource.columns.map((c) => [c.name, c.description])}
          containerStyle={{ paddingBottom: "30px" }}
        />
      </VStack>
      <VStack width="100%" spacing={3} alignItems="flex-start">
        <Title>Consulta aos dados</Title>
        <HStack>
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
        </HStack>
        <Highlight
          style={{ width: "100%" }}
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
                wordBreak: "break-all",
              }}
            >
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </VStack>
      <VStack width="100%" spacing={3} alignItems="flex-start">
        <Title>Metadados</Title>
        <SimpleTable
          containerStyle={{ maxWidth: "80vh" }}
          headers={["nome", "valor"]}
          values={Object.entries(resource).map(([key, value]) => [
            key,
            JSON.stringify(value),
          ])}
        />
      </VStack>
    </BaseResourcePage>
  );
}

function ExternalLinkPage({ resource }) {
  return (
    <BaseResourcePage
      title={resource.name}
      buttonText="Acessar"
      onClick={() => window.open(resource.url)}
    >
      <VStack spacing={3} alignItems="flex-start">
        <SectionText>
          <b>Descrição</b>
        </SectionText>
        <SectionText fontWeight="400" fontSize="14px">
          {resource.description || "Nenhuma descrição fornecida."}
        </SectionText>
      </VStack>
      <VStack width="100%" spacing={3} alignItems="flex-start">
        <Title>Metadados</Title>
        <SimpleTable
          containerStyle={{ maxWidth: "80vh" }}
          headers={["nome", "valor"]}
          values={Object.entries(resource).map(([key, value]) => [
            key,
            JSON.stringify(value),
          ])}
        />
      </VStack>
    </BaseResourcePage>
  );
}

export default function DatasetPage({
  dataset,
  bdmTables,
  externalLinks,
  strapiPages,
  isPlus,
}) {
  const [resource, setResource] = useState(
    bdmTables.length > 0 ? bdmTables[0] : externalLinks[0]
  );

  console.log(dataset);

  function getResourcePage() {
    switch (resource.resource_type) {
      case "bdm_table":
        return (
          <BdmTablePage datasetName={dataset.dataset_id} resource={resource} />
        );

      case "external_link":
        return <ExternalLinkPage resource={resource} />;

      default:
        return <BdmTablePage resource={resource} />;
    }
  }

  return (
    <MainPageTemplate strapiPages={strapiPages}>
      <Flex
        direction={{ base: "column", lg: "row" }}
        width={{ base: "90%", lg: "85%" }}
        margin="auto"
        spacing={20}
      >
        <VStack alignItems={{ base: "flex-start", lg: "flex-start" }}>
          <Image
            borderRadius="31.8889px"
            boxShadow="0px 0px 10px rgba(0,0,0,0.25)"
            minWidth="200px"
            minHeight="200px"
            margin="auto"
            borderRadius="31px"
            objectFit="contain"
            src={
              "https://basedosdados.org/uploads/group/" +
              dataset.organization.image_url
            }
          />
          <Stack
            paddingTop={{ base: "30px", lg: "0px" }}
            spacing={6}
            direction={{ base: "column", lg: "column" }}
          >
            <VStack alignItems="flex-start">
              <Title>Organização</Title>
              <SectionText fontWeight="400" fontSize="14px">
                {dataset.organization.title}
              </SectionText>
            </VStack>
            <VStack alignItems="flex-start">
              <Title paddingTop="">Temas</Title>
              {dataset.groups.map((g) => (
                <HStack key={g.name}>
                  <CategoryIcon
                    size="39px"
                    url={`/_nxt/img/categories/icone_${g.name}${
                      isPlus ? "-1" : ""
                    }.svg`}
                  />
                  <SectionText>{g.display_name}</SectionText>
                </HStack>
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
          <SectionText fontWeight="400" fontSize="14px" textAlign="left">
            {dataset.notes}
          </SectionText>
          <Stack
            paddingTop="20px"
            direction={{ base: "column", lg: "row" }}
            spacing={4}
            width="100%"
          >
            <VStack
              minWidth={{ base: "100%", lg: "200px" }}
              maxWidth={{ base: "100%", lg: "200px" }}
              spacing={5}
            >
              {bdmTables.length > 0 ? (
                <FilterAccordion
                  choices={bdmTables}
                  value={resource.name}
                  valueField="name"
                  displayField="name"
                  fieldName="Tabelas"
                  onChange={(name) =>
                    setResource(bdmTables.filter((b) => b.name === name)[0])
                  }
                />
              ) : (
                <></>
              )}
              {externalLinks.length > 0 ? (
                <FilterAccordion
                  choices={externalLinks}
                  valueField="name"
                  displayField="name"
                  fieldName="Links Externos"
                  value={resource.name}
                  onChange={(name) =>
                    setResource(externalLinks.filter((b) => b.name === name)[0])
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
