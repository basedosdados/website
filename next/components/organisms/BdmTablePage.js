import {
  VStack,
  Stack,
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
    name: "Nome da coluna.",
    bigquery_type: "Tipo de dado no BigQuery — categorias: INTEGER (Inteiro), STRING (Texto), DATE (Data), FLOAT64 (Decimal), GEOGRAPHY (Geográfico).",
    description: "Descrição dos dados da coluna.",
    temporal_coverage: "Data inicial e final de cobertura dos dados. Pode variar entre colunas, de acordo com a disponibilidade nos dados originais.",
    covered_by_dictionary: "Indica se a coluna possui categorias descritas na tabela 'dicionario', explicando o significado das suas chaves e valores — ex: 'sexo' possui os valores 0 e 1 na coluna, e, no dicionario, você irá encontrar 'sexo' com as categorias (chave: 1 - valor: Feminino), (chave: 0 - valor: Masculino).",
    directory_column: "Caso preenchida, indica que a coluna é chave primária de uma entidade — ex: id_municipio = chave primária de municípios. Isso significa que a coluna é igual em todos os conjuntos do datalake. Informações centralizadas da entidade se encontram no diretório conforme: [diretorio].[tabela]:[coluna].",
    measurement_unit: "Unidade de medida da coluna — ex: km, m2, kg.",
    has_sensitive_data: "Indica se a coluna possui dados sensíveis — ex: CPF identificado, dados de conta bancária, etc.",
    observations: "Descreve processos de tratamentos realizados na coluna que precisam ser evidenciados."
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
      if(resource.columns.length === 0) {
        setColumnsValues(resource.columns)
        setShowColumns(false)
      } else {
        setColumnsValues(resource.columns)
        setShowColumns(true)
      }
    }
    if(resource.temporal_coverage) {
      if(resource.temporal_coverage.length === 0) {
        setTemporalCoverage(getTemporalCoverage(resource.temporal_coverage))
        setShowTemporalCoverage(false)
      } else {
        setTemporalCoverage(getTemporalCoverage(resource.temporal_coverage))
        setShowTemporalCoverage(true)
      }
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
      
      <VStack id="acesso" width="100%" spacing={4} alignItems="flex-start">
        <Subtitle>Cobertura temporal</Subtitle>
        {showTemporalCoverage ?
          <SectionText>
            {temporalCoverage}
          </SectionText>
        :
          <SectionText>
            Nenhuma cobertura temporal fornecida
          </SectionText>
        }
      </VStack>

      <VStack id="acesso" width="100%" spacing={5} alignItems="flex-start">
        <Subtitle>
          Colunas
        </Subtitle>
        {showColumns ?
          <ColumnDatasets
            translations={translations.bdm_columns}
            availableOptionsTranslations={availableOptionsTranslations}
            translationsOptions={translationsOptions}
            parentTemporalCoverage={temporalCoverage}
            tooltip={tooltip}
            headers={columnsHeaders}
            values={columnsValues}
          />
        :
          <SectionText>
            Nenhuma informação de coluna fornecida
          </SectionText>
        }
      </VStack>

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
