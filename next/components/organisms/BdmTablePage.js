import { VStack, Text } from "@chakra-ui/react";
import { Markdown } from "../atoms/Markdown";
import Title from "../atoms/Title";
import { ExpandableTable, ExpandableTableHorizontal } from "../molecules/ExpandableTable";
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
  if (
    resource.spatial_coverage &&
    typeof resource.spatial_coverage === "array"
  ) {
    resource.spatial_coverage = resource.spatial_coverage.sort();
  }

  return (
    <BaseResourcePage
      padding="20px 17px"
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
          {resource.temporal_coverage[0] || "Nenhuma cobertura temporal."}
        </Text>
      </VStack>
      <VStack id="acesso" width="100%" spacing={3} alignItems="flex-start">
        <Title fontWeigth="400">
          Coluna
        </Title>
        <ExpandableTable
          headers={["nome", "descrição"]}
          values={(resource?.columns || []).map((c) => [c.name, c.description])}
        />
      </VStack>
      
      <VStack width="100%" spacing={3} alignItems="flex-start">
        <Title fontWeigth="400">Metadados da tabela</Title>
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
      </VStack>
    </BaseResourcePage>
  );
}
