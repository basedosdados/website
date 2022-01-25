import { Button } from "@chakra-ui/button";
import { VStack, Text, Stack, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LinkDash } from "../atoms/LinkDash";
import { Markdown } from "../atoms/Markdown";
import SectionText from "../atoms/SectionText";
import Title from "../atoms/Title";
import { ExpandableTable } from "../molecules/ExpandableTable";
import {
  breakNestedObjects,
  filterOnlyValidValues,
  formatObjectsInArray,
  translate,
} from "../../utils";
import { BaseResourcePage } from "../molecules/BaseResourcePage";
import { SchemaForm } from "../molecules/SchemaForm";
import { getBdmTableSchema } from "../../pages/api/schemas";
import { deleteResource, updateResource } from "../../pages/api/datasets";
import { BlueBox } from "../molecules/BlueBox";
import RoundedButton from "../atoms/RoundedButton";
import Link from "../atoms/Link";

export function BdmTablePage({
  translations,
  resource,
  datasetName,
  availableOptionsTranslations,
}) {
  const [selectedConsultation, setSelectedConsultation] = useState("SQL");
  const consultationOptions = ["SQL", "Python", "R", "Download"];
  const queryName = `${resource.dataset_id}.${resource.name}`;

  if (
    resource.spatial_coverage &&
    typeof resource.spatial_coverage === "array"
  ) {
    resource.spatial_coverage = resource.spatial_coverage.sort();
  }

  const consultationLanguage = {
    SQL: "sql",
    Python: "python",
    R: "R",
  };

  const helpText = {
    SQL: (
      <>
        Copie o código,{" "}
        <LinkDash
          fontWeight="700"
          textDecoration="none"
          dash={false}
          href={`https://console.cloud.google.com/bigquery?p=basedosdados&d=${resource.dataset_id}&t=${resource.name}&page=table`}
        >
          clique para ir ao <i>datalake</i>
        </LinkDash>{" "}
        no BigQuery e cole no Editor de Consultas:
      </>
    ),
    Python: (
      <>
        Criamos um pacote em Python para você acessar o <i>datalake</i>. Basta
        rodar o código:
      </>
    ),
    R: (
      <>
        Criamos um pacote em R para você acessar o <i>datalake</i>. Basta rodar
        o código:
      </>
    ),
    Download: (
      <>
        <BlueBox
          title="Estes dados estão disponíveis porque diversas pessoas colaboram para a sua manutenção."
          text={
            <>
              Apoie você também com doação financeira ou{" "}
              <LinkDash
                fontWeight="bold"
                textDecoration="none"
                target="_blank"
                href="https://basedosdados.github.io/mais/colab/"
                dash={false}
              >
                saiba como contribuir com seu tempo.
              </LinkDash>
            </>
          }
        />
        <Stack
          paddingTop="30px"
          paddingBottom="20px"
          align="center"
          direction={{ base: "column", lg: "row" }}
          justify="space-between"
        >
          <Image
            height="130px"
            objectFit="contain"
            src="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/bd_qrcode.png"
          />
          <SectionText
            padding={{ base: "0px 0px", lg: "10px 0px" }}
            marginLeft="auto"
            fontWeight="400"
            fontSize="13px"
          >
            <Text fontWeight="bold" fontFamily="Ubuntu" fontSize="18px">
              Doe via PIX
            </Text>
            <br />
            Chave CNPJ
            <br /> 42494318000116
          </SectionText>
          <Link
            maxWidth="180px"
            width="100%"
            textDecoration="none !important"
            target="_blank"
            href="/#support"
          >
            <RoundedButton width="100%">Doação mensal</RoundedButton>
          </Link>
          <Link
            maxWidth="210px"
            width="100%"
            textDecoration="none !important"
            href={`https://storage.googleapis.com/basedosdados-public/one-click-download/${resource.dataset_id}/${resource.name}.zip`}
          >
            <RoundedButton
              width="100%"
              color="#3AA1EB"
              border="2px solid #3AA1EB"
              backgroundColor="white"
              colorScheme="gray"
            >
              Download dos dados
            </RoundedButton>
          </Link>
        </Stack>
      </>
    ),
  };

  const helpLink = {
    SQL: "https://basedosdados.github.io/mais/access_data_bq/#primeiros-passos",
    Python:
      "https://basedosdados.github.io/mais/access_data_packages/#primeiros-passos",
    R: "https://basedosdados.github.io/mais/access_data_packages/#primeiros-passos",
  };

  const consultationText = {
    SQL: `SELECT * FROM \`basedosdados.${queryName}\` LIMIT 100`,
    Python: `import basedosdados as bd
# Para carregar o dado direto no pandas
df = bd.read_table(dataset_id='${resource.dataset_id}', 
table_id='${resource.name}',
billing_project_id="<YOUR_PROJECT_ID>")`,
    R: `install.packages("basedosdados")
library("basedosdados")
# Defina o seu projeto no Google Cloud
set_billing_id("<YOUR_PROJECT_ID>")
# Para carregar o dado direto no R
query <- bdplyr("${queryName}")
df <- bd_collect(query)`,
  };

  useEffect(() => {
    if (window) window.Prism.highlightAll();
  }, [consultationText]);

  return (
    <BaseResourcePage
      editLink={`/resource/edit/${resource.id}`}
      title={`${resource.name}`}
      removeFunction={() => deleteResource(resource)}
      formComponent={
        <SchemaForm
          data={resource}
          schemaName="Tabela Bdm"
          loadSchemaFunction={getBdmTableSchema}
          updateFunction={updateResource}
          prepareData={(data) => {
            data.identifying_columns = data.identifying_columns || [];
            data.published_by.github_user = data.published_by.github_user || "";
            data.published_by.ckan_user = data.published_by.ckan_user || "";
            data.data_cleaned_by.github_user =
              data.data_cleaned_by.github_user || "";
            data.data_cleaned_by.ckan_user =
              data.data_cleaned_by.ckan_user || "";
            data.data_cleaned_by.website = data.data_cleaned_by.website || "";
            data.resource_type = "bdm_table";

            return data;
          }}
        />
      }
    >
      <VStack width="100%" spacing={3} alignItems="flex-start">
        <BlueBox
          title="Esta tabela está tratada e atualizada no nosso datalake público."
          text={
            <>
              Você pode consultar seus dados via download, SQL (BigQuery),
              Python ou R{" "}
              <LinkDash
                fontWeight="bold"
                textDecoration="none"
                target="_self"
                href="#acesso"
                dash={false}
              >
                abaixo.
              </LinkDash>
            </>
          }
        />
        <SectionText padding="10px 0px">
          <b>Descrição</b>
        </SectionText>
        <Markdown>
          {resource.description || "Nenhuma descrição fornecida."}
        </Markdown>
      </VStack>
      <VStack id="acesso" width="100%" spacing={3} alignItems="flex-start">
        <SectionText>
          <b>Coluna</b>
        </SectionText>
        <ExpandableTable
          headers={["nome", "descrição"]}
          values={(resource?.columns || []).map((c) => [c.name, c.description])}
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
        </Stack>
        {helpText[selectedConsultation] ? (
          <SectionText width="100%" fontSize="14px" fontWeight="300">
            {helpText[selectedConsultation]}
          </SectionText>
        ) : (
          <></>
        )}
        {consultationText[selectedConsultation] ? (
          <>
            <pre
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                whiteSpace: "break-spaces",
                wordBreak: "break-all",
              }}
            >
              <code
                className={`language-${consultationLanguage[selectedConsultation]}`}
              >
                {consultationText[selectedConsultation]}
              </code>
            </pre>
            <SectionText fontSize="14px" fontWeight="300">
              <i>
                Para consulta é necessário um projeto no Google Cloud.{" "}
                <b>Primeira vez?</b>{" "}
                <LinkDash
                  href={helpLink[selectedConsultation]}
                  dash={false}
                  fontWeight="bold"
                  textDecoration="none"
                >
                  Siga o passo a passo.
                </LinkDash>
              </i>
            </SectionText>
            <script key={selectedConsultation} src="/vendor/prism.js"></script>
          </>
        ) : (
          <></>
        )}
      </VStack>
      <VStack width="100%" spacing={3} alignItems="flex-start">
        <Title>Metadados da tabela</Title>
        <ExpandableTable
          containerStyle={{ width: "100%", alignItems: "flex-start" }}
          headers={["nome", "valor"]}
          values={formatObjectsInArray(
            translate(
              translations,
              availableOptionsTranslations,
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
