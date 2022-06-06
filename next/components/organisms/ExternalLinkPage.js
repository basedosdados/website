import {
  VStack,
  Stack,
  Box,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { ExpandableTable } from "../molecules/ExpandableTable";
import {
  filterOnlyValidValues,
  formatObjectsInArray,
  translate,
} from "../../utils";
import { BaseResourcePage } from "../molecules/BaseResourcePage";
import { deleteResource, updateResource } from "../../pages/api/datasets";
import { getExternalLinkSchema } from "../../pages/api/schemas";
import { SchemaForm } from "../molecules/SchemaForm";

export function ExternalLinkPage({
  translations,
  resource,
  availableOptionsTranslations,
}) {
  return (
    <BaseResourcePage
      title={resource.name}
      removeFunction={() => deleteResource(resource)}
      formComponent={
        <SchemaForm
          data={resource}
          updateFunction={updateResource}
          loadSchemaFunction={getExternalLinkSchema}
          schemaName="Fonte original"
          prepareData={(data) => {
            data.country_ip_address_required =
              data.country_ip_address_required || [];
            data.maintainer = data.maintainer || "";
            data.maintainer_email = data.maintainer_email || "";
            data.resource_type = "external_link";

            return data;
          }}
        />
      }
      isShowButtons={true}
      urlExternal={resource.url}
    >

      <VStack width="100%" spacing={3} alignItems="flex-start">
        <ExpandableTable
          headers={["nome", "valor"]}
          values={formatObjectsInArray(
            translate(
              translations,
              availableOptionsTranslations,
              filterOnlyValidValues(resource, [
                "title",
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
                "observation_level",
              ])
            )
          )}
        />
      </VStack>
    </BaseResourcePage>
  );
}
