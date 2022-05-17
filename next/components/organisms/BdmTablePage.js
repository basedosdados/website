import {
  VStack,
  Stack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Subtitle from "../atoms/Subtitle";
import SectionText from "../atoms/SectionText";
import { ExpandableTable } from "../molecules/ExpandableTable";
import ColumnDatasets from "../molecules/ColumnDatasets";
import {
  breakNestedObjects,
  filterOnlyValidValues,
  formatObjectsInArray,
  translate,
  getTemporalCoverage,
} from "../../utils";
import { BaseResourcePage } from "../molecules/BaseResourcePage";
import { SchemaForm } from "../molecules/SchemaForm";
import { getBdmColumnsSchema } from '../../pages/api/schemas'
import { getBdmTableSchema } from "../../pages/api/schemas";
import { deleteResource, updateResource } from "../../pages/api/datasets";
import DataInformationQuery from "../molecules/DataInformationQuery";

export function BdmTablePage({
  availableOptionsTranslations,
  translationsOptions,
  translations,
  datasetName,
  resource,
}) {

  const [showColumns, setShowColumns] = useState(false)
  const [showTemporalCoverage, setShowTemporalCoverage] = useState(false)
  const [schema, setSchema] = useState({})
  const [columnsHeaders, setColumnsHeaders] = useState([])
  const [columnsValues, setColumnsValues] = useState([])
  const [temporalCoverage, setTemporalCoverage] = useState([])
  const tooltip = {
    name: "Indica o nome de cada coluna para cada ano.",
    bigquery_type: "Indica o tipo de dado no BigQuery. Ex.: INT64 (Inteiro), STRING (String), DATA (Data), FLOA64 (Float) etc.",
    description: "Indica a descrição dos dados da coluna.",
    temporal_coverage: "Indica a cobertura temporal da coluna.",
    covered_by_dictionary: "Indica se a coluna é coberta por dicionário.",
    directory_column: "Indica se a coluna é coberta por um dicionário da BD.",
    measurement_unit: "Indica a unidade de medida da coluna. ",
    has_sensitive_data: "Indica se a coluna possui dados sensíveis. Ex.:  CPF identificado, dados de conta bancária, etc. ",
    observations: "Indica processos de tratamentos realizados na coluna que precisam ser evidenciados. "
  }

  useEffect(() => {
    fetchSchema()
  },[])
  
  async function fetchSchema()  {
    const columnsSchema = await getBdmColumnsSchema()
    setSchema(columnsSchema)
  }

  useEffect(() => {
    setColumnsHeaders(Object.keys(schema))
    if(resource.columns) {
      setColumnsValues(resource.columns)
      setShowColumns(true)
    }
    if(resource.temporal_coverage) {
      setTemporalCoverage(getTemporalCoverage(resource.temporal_coverage))
      setShowTemporalCoverage(true)
    }

  },[schema, resource])

  if (
    resource.spatial_coverage &&
    typeof resource.spatial_coverage === "array"
  ) {
    resource.spatial_coverage = resource.spatial_coverage.sort();
  }

  return (
    <BaseResourcePage
      padding="16px 8px 0 0"
      editLink={`/resource/edit/${resource.id}`}
      title={`${resource.name}`}
      removeFunction={() => deleteResource(resource)}
      formComponent={
        <SchemaForm
          data={resource}
          schemaName="Tabela BD+"
          loadSchemaFunction={getBdmTableSchema}
          updateFunction={updateResource}
          prepareData={(data) => {
            data.observation_level = data.observation_level || [];
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
      <DataInformationQuery resource={resource} />

      <VStack width="100%" spacing={4} alignItems="flex-start">
        <Subtitle>Descrição</Subtitle>
        <SectionText>
          {resource.description || "Nenhuma descrição fornecida."}
        </SectionText>
      </VStack>
      
      {showTemporalCoverage &&
        <VStack id="acesso" width="100%" spacing={4} alignItems="flex-start">
          <Subtitle>Cobertura temporal</Subtitle>
          <SectionText>
            {temporalCoverage}
          </SectionText>
        </VStack>
      }

      {showColumns &&
        <VStack id="acesso" width="100%" spacing={5} alignItems="flex-start">
          <Subtitle>
            Colunas
          </Subtitle>
            <ColumnDatasets
              translations={translations.bdm_columns}
              availableOptionsTranslations={availableOptionsTranslations}
              translationsOptions={translationsOptions}
              parentTemporalCoverage={temporalCoverage}
              tooltip={tooltip}
              headers={columnsHeaders}
              values={columnsValues}
            />
        </VStack>
      }

      <VStack width="100%" spacing={3} alignItems="flex-start">
        <Accordion
          borderColor="transparent"
          borderWidth={0}
          width="100%"
          ex
          allowToggle
        >
          <AccordionItem>
            <AccordionButton marginBottom={5} padding={0} _hover={{backgroundColor: "transparent"}} >
              <Stack flex='1' textAlign='left'>
                <Subtitle>Informações adicionais</Subtitle>
              </Stack>
              <AccordionIcon color="#252A32" fontSize="18px"/>
            </AccordionButton>

            <AccordionPanel padding={0}>
              <ExpandableTable
                containerStyle={{ width: "100%", alignItems: "flex-start" }}
                headers={["nome", "valor"]}
                values={formatObjectsInArray(
                  translate(
                    translations.bdm_table,
                    availableOptionsTranslations,
                    filterOnlyValidValues({ dataset_id: datasetName, ...resource }, [
                      "dataset_id",
                      "table_id",
                      "spatial_coverage",
                      "update_frequency",
                      "observation_level",
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
                      "columns",
                    ])
                  )
                )}
              />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </BaseResourcePage>
  );
}
