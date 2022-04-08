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
      setColumnsHeaders(Object.keys(resource.columns[0]))
      setColumnsValues(
        resource.columns.map((c) => {
          return Object.values(c)
        })
      )
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
        <SectionText>
          {resource?.temporal_coverage ? resource.temporal_coverage[0] : "Nenhuma cobertura temporal fornecida."}
        </SectionText>
      </VStack>
      {isColumns &&
        <VStack id="acesso" width="100%" spacing={5} alignItems="flex-start">
          <Subtitle>Colunas</Subtitle>
            <ExpandableTable
              translations={translations.bdm_columns}
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
