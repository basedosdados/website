import { 
  VStack,
  HStack,
  Image,
  Box, 
  Text,
} from "@chakra-ui/react";
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
      urlExternal={resource.url}
    >
      <VStack marginTop="0 !important" width="100%" letterSpacing="0.5px" spacing={3} alignItems="flex-start">
        <VStack
          alignItems="flex-start"
          padding="15px 0"
          borderRadius="10px"
          color="#252A32"
          fontFamily="Lato"
          fontSize="16px"
          spacing={5}
        >
          <Text fontWeight="300">
            A disponibilização destes dados é resultado de uma parceria com:
          </Text>
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
              <Text fontWeight="300" fontSize="14px">
                Agência de dados públicos independente e especializada na Lei de Acesso à Informação.
              </Text>
            </Box>
          </HStack>
        </VStack>

        <VStack
          alignItems="flex-start"
          marginTop="30px !important"
          fontFamily="Lato"
          fontSize="16px"
        >
          <Title fontWeigth="normal">Detalhes do pedido</Title>
          <Text fontWeight="300" fontSize="14px">
            Você pode consultar o <Link isExternal={true} url={resource.url} color="#42B0FF"> pedido </Link> para saber mais detalhes. 
          </Text>
        </VStack>


        <Title marginTop="30px !important" fontWeigth="normal">Metadados do pedido</Title>
        <ExpandableTable
          headers={["nome", "valor"]}
          values={formatObjectsInArray(
            translate(
              translations,
              availableOptionsTranslations,
              filterOnlyValidValues(resource, [
                "data_url",
                "dataset_id",
                "description",
                "format",
                "hash",
                "mimetype",
                "mimetype_inner",
                "name",
                "number",
                "requested_by",
                "resource_type",
                "size",
                "spatial_coverage",
                "state",
                "url",
                "url_type",
              ])
            )
          )}
        />
      </VStack>
    </BaseResourcePage>
  );
}
