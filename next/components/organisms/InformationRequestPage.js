import { VStack, Image } from "@chakra-ui/react";
import Title from "../atoms/Title";
import { ExpandableTable } from "../molecules/ExpandableTable";
import {
  filterOnlyValidValues,
  formatObjectsInArray,
  translate,
} from "../../utils";
import { BaseResourcePage } from "../molecules/BaseResourcePage";
import { deleteResource, updateResource } from "../../pages/api/datasets";
import { getInformationRequestSchema } from "../../pages/api/schemas";
import { SchemaForm } from "../molecules/SchemaForm";

export function InformationRequestPage({
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
          loadSchemaFunction={getInformationRequestSchema}
          schemaName="Pedidos LAI"
          prepareData={(data) => {
            data.country_ip_address_required =
              data.country_ip_address_required || [];
            data.maintainer = data.maintainer || "";
            data.maintainer_email = data.maintainer_email || "";
            data.resource_type = "information_request";

            return data;
          }}
        />
      }
      buttonText="Acessar"
      buttonRightIcon={<Image src="/img/icons/white_right_arrow.svg" />}
      onClick={() => window.open(resource.url)}
    >
      <VStack width="100%" spacing={3} alignItems="flex-start">
        <Title>Metadados do pedido LAI</Title>
        <ExpandableTable
          headers={["nome", "valor"]}
          values={formatObjectsInArray(
            translate(
              translations,
              availableOptionsTranslations,
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
                "observation_level",
              ])
            )
          )}
        />
      </VStack>
    </BaseResourcePage>
  );
}
