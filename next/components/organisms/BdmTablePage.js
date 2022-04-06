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
import { Markdown } from "../atoms/Markdown";
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
import DataInformationQuery from "../molecules/DataInformationQuery";

export function BdmTablePage({
  translations,
  resource,
  datasetName,
  availableOptionsTranslations,
}) {
  const [isColumns, setIsColumns] = useState(false)
  const [columnsHeaders, setColumnsHeaders] = useState([])
  const [columnsValues, setColumnsValues] = useState([])

  useEffect(() => {
    if (resource.columns[0]) {
      setIsColumns(true)

      const ArrayHeaders = Object.keys(resource.columns[0])
      const ArrayValues = resource.columns.map((c) => {
        return Object.values(c)
      })
      const filter = ["is_in_staging"]

      filter.map((elm) => {
        for( let i = 0; i < ArrayHeaders.length; i++){
          if ( ArrayHeaders[i] === elm) {
            ArrayHeaders.splice(i, 1)
            ArrayValues.map(c => {
              c.splice(i, 1)
            })
            i--
            setColumnsHeaders(ArrayHeaders)
            setColumnsValues(ArrayValues)
            console.log(columnsHeaders)
          } else {
            setColumnsHeaders(ArrayHeaders)
            setColumnsValues(ArrayValues)
          }
        }
      })
    }
  },[resource])

  if (
    resource.spatial_coverage &&
    typeof resource.spatial_coverage === "array"
  ) {
    resource.spatial_coverage = resource.spatial_coverage.sort();
  }
  return (
    <BaseResourcePage
      padding="20px 10px 20px 0"
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

      <VStack width="100%" spacing={3} alignItems="flex-start">
        <Title fontWeigth="400">
          Descrição
        </Title>
        <Markdown
          styleText= {{
            fontSize:"14px",
            fontWeight:"300",
            letterSpacing:"0.5px",
            color:"#252A32"
          }}
        >
          {resource.description || "Nenhuma descrição fornecida."}
        </Markdown>
      </VStack>
      <VStack id="acesso" width="100%" spacing={3} alignItems="flex-start">
        <Title fontWeigth="400">
          Cobertura temporal
        </Title>
        <Text color="#252A32" fontSize="14px" fontWeight="300" fontFamily="Lato" letterSpacing="0.5px">
          {resource?.temporal_coverage ? resource.temporal_coverage[0] : "Nenhuma cobertura temporal."}
        </Text>
      </VStack>
      {isColumns &&
        <VStack id="acesso" width="100%" spacing={5} alignItems="flex-start">
          <Title fontWeigth="400">
            Coluna
          </Title>
            <ExpandableTable
              translations={translations.bdm_columns}
              availableOptionsTranslations={availableOptionsTranslations}
              horizontal={true}
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
                <Title fontWeigth="400">Informações adicionais</Title>
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
