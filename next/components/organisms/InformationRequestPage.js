import {
  VStack,
  HStack,
  Image,
  Box,
  Text,
} from "@chakra-ui/react";
import Subtitle from "../atoms/Subtitle";
import SectionText from "../atoms/SectionText";
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
import Link from "../atoms/Link";

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
      isShowButtons={true}
      urlExternal={resource.url}
      urlInformationRequest={resource.data_url}
    >
      <VStack marginTop="0 !important" width="100%" letterSpacing="0.5px" spacing={3} alignItems="flex-start">
        <VStack
          alignItems="flex-start"
          borderRadius="10px"
          marginTop="20px"
          color="#252A32"
          fontFamily="Lato"
          fontSize="16px"
          spacing={5}
        >
          <SectionText>
            A disponibilização destes dados é resultado de uma parceria com:
          </SectionText>
          <HStack margin="10px 0" gridGap={2}>
            <Image
              border="1px solid #DEDFE0"
              borderRadius="10px"
              src={"/img/icons/fiquem_sabendo.png"}
              width="80px"
              height="80px"
              onClick={() => window.open("https://fiquemsabendo.com.br/")}
              cursor="pointer"
            />
            <Box>
              <Text
                width="130px"
                onClick={() => window.open("https://fiquemsabendo.com.br/")}
                cursor="pointer"
                marginBottom="5px"
                fontWeight="bold"
              >
                Fiquem Sabendo
              </Text>
              <SectionText>
                Agência de dados públicos independente e especializada na Lei de Acesso à Informação.
              </SectionText>
            </Box>
          </HStack>
        </VStack>

        <VStack
          alignItems="flex-start"
          marginTop="32px !important"
          fontFamily="Lato"
          fontSize="16px"
        >
          <Subtitle marginBottom="8px !important">Descrição</Subtitle>
          <SectionText>
            {resource.description}
          </SectionText>
        </VStack>
        <Subtitle margin="32px 0 10px !important">Metadados do pedido</Subtitle>
        <ExpandableTable
          headers={["nome", "valor"]}
          values={formatObjectsInArray(
            translate(
              translations,
              availableOptionsTranslations,
              filterOnlyValidValues(resource, [
                "dataset_id",
                "format",
                "hash",
                "mimetype",
                "mimetype_inner",
                "number",
                "requested_by",
                "size",
                "spatial_coverage",
                "state",
              ])
            )
          )}
        />
      </VStack>
    </BaseResourcePage>
  );
}
