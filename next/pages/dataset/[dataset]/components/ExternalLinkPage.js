import { VStack, Image } from "@chakra-ui/react";
import Title from "../../../../components/atoms/Title";
import { ExpandableTable } from "../../../../components/molecules/ExpandableTable";
import {
  filterOnlyValidValues,
  formatObjectsInArray,
  translate,
} from "../../../../utils";
import { BaseResourcePage } from "./BaseResourcePage";

export function ExternalLinkPage({ translations, resource }) {
  return (
    <BaseResourcePage
      title={resource.name}
      buttonText="Acessar"
      buttonRightIcon={<Image src="/img/icons/white_right_arrow.svg" />}
      onClick={() => window.open(resource.url)}
    >
      <VStack width="100%" spacing={3} alignItems="flex-start">
        <Title>Metadados do link externo</Title>
        <ExpandableTable
          headers={["nome", "valor"]}
          values={formatObjectsInArray(
            translate(
              translations,
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
                "entity",
                "time_unit",
              ])
            )
          )}
        />
      </VStack>
    </BaseResourcePage>
  );
}
