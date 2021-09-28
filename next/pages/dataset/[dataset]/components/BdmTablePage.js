import { Button } from "@chakra-ui/button";
import { VStack, Text, Stack } from "@chakra-ui/layout";
import Highlight, { defaultProps } from "prism-react-renderer";
import { useState } from "react";
import Link from "../../../../components/atoms/Link";
import { LinkDash } from "../../../../components/atoms/LinkDash";
import { Markdown } from "../../../../components/atoms/Markdown";
import SectionText from "../../../../components/atoms/SectionText";
import Title from "../../../../components/atoms/Title";
import { ExpandableTable } from "../../../../components/molecules/ExpandableTable";
import {
  filterOnlyValidValues,
  formatObjectsInArray,
  translate,
} from "../../../../utils";
import { BaseResourcePage } from "./BaseResourcePage";

export function BdmTablePage({ translations, resource, datasetName }) {
  const [selectedConsultation, setSelectedConsultation] = useState("SQL");
  const consultationOptions = ["SQL", "Python", "R"];
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
    R: "r",
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
    query <- "SELECT * FROM \`basedosdados.${queryName}\`"
    df <- read_sql(query)`,
  };

  return (
    <BaseResourcePage
      editLink={`/resource/edit/${resource.id}`}
      title={`${resource.name}`}
    >
      <VStack width="100%" spacing={3} alignItems="flex-start">
        <Text
          fontFamily="Lato"
          lineHeight="24px"
          letterSpacing="0.1em"
          fontWeight="400"
          fontSize="14px"
          backgroundColor="rgba(130, 202, 255, 0.15);"
          padding="15px 20px"
          borderRadius="20px"
          width="100%"
        >
          <b>
            Esta tabela está tratada e atualizada no nosso datalake público.
          </b>
          <br /> Você pode consultar seus dados via download, SQL (BigQuery),
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
        </Text>
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
        <SectionText fontSize="14px" fontWeight="300">
          {helpText[selectedConsultation]}
        </SectionText>
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
      </VStack>
      <VStack width="100%" spacing={3} alignItems="flex-start">
        <Title>Metadados da tabela</Title>
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
