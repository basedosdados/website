import {
  HStack,
  Image,
  Stack,
  VStack,
  Text,
  Box
} from "@chakra-ui/react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

import LinkIcon from "../../public/img/icons/linkIcon";
import InfoArrowIcon from "../../public/img/icons/infoArrowIcon";
import { DataBaseSolidIcon } from "../../public/img/icons/databaseIcon";

export default function Database({
  id,
  name,
  temporalCoverageText,
  organization,
  tables,
  rawDataSources,
  informationRequests,
  contains,
}) {

  const Tables = () => {
    let tablesNumber = tables.number
    if(tables.number === undefined) tablesNumber = 0

    return (
      <Text
        as="a"
        display="flex"
        flexDirection="row"
        alignItems="center"
        cursor={tablesNumber > 0 ? "pointer" : "normal"}
        color={tablesNumber === 0 ? "#ACAEB1" : "#0068C5"}
        fill={tablesNumber === 0 ? "#ACAEB1" : "#0068C5"}
        pointerEvents={tablesNumber === 0 && "none"}
        fontFamily="Roboto"
        fontWeight="400"
        fontSize="14px"
        lineHeight="20px"
        _hover={{
          color: "#0057A4",
          fill: "#0057A4"
        }}
        href={tablesNumber > 0 ? `/dataset/${id}?table=${tables.id}` : ""}
      >
        <DataBaseSolidIcon
          alt="tabelas tratadas"
          width="15px"
          height="15px"
        />
        <Text
          marginLeft="4px !important"
          whiteSpace="nowrap"
        >
          {tablesNumber}{" "}
          {tablesNumber === 1 ? "tabela tratada" : "tabelas tratadas"}
        </Text>
      </Text>
    )
  }

  const RawDataSources = () => {
    let rawDataSourcesNumber = rawDataSources.number
    if(rawDataSources.number === undefined) rawDataSourcesNumber = 0

    return (
      <Text
        as="a"
        display="flex"
        flexDirection="row"
        alignItems="center"
        cursor={rawDataSourcesNumber > 0 ? "pointer" : "normal"}
        color={rawDataSourcesNumber === 0 ? "#ACAEB1" : "#0068C5"}
        fill={rawDataSourcesNumber === 0 ? "#ACAEB1" : "#0068C5"}
        pointerEvents={rawDataSourcesNumber === 0 && "none"}
        fontFamily="Roboto"
        fontWeight="400"
        fontSize="14px"
        lineHeight="20px"
        _hover={{
          color: "#0057A4",
          fill: "#0057A4"
        }}
        href={rawDataSourcesNumber > 0 ? `/dataset/${id}?raw_data_source=${rawDataSources.id}` : ""}
      >
        <LinkIcon
          alt="fontes originais"
          width="15px"
          height="15px"
        />
        <Text
          marginLeft="4px !important"
          whiteSpace="nowrap"
        >
          {rawDataSourcesNumber}{" "}
          {rawDataSourcesNumber === 1 ? "fonte original" : "fontes originais"}
        </Text>
      </Text>
    )
  }

  const InformationRequest = () => {
    let informationRequestsNumber = informationRequests.number
    if(informationRequests.number === undefined) informationRequestsNumber = 0

    return (
      <Text
        as="a"
        display="flex"
        flexDirection="row"
        alignItems="center"
        cursor={informationRequestsNumber > 0 ? "pointer" : "normal"}
        color={informationRequestsNumber === 0 ? "#ACAEB1" : "#0068C5"}
        fill={informationRequestsNumber === 0 ? "#ACAEB1" : "#0068C5"}
        pointerEvents={informationRequestsNumber === 0 && "none"}
        fontFamily="Roboto"
        fontWeight="400"
        fontSize="14px"
        lineHeight="20px"
        _hover={{
          color: "#0057A4",
          fill: "#0057A4"
        }}
        href={informationRequestsNumber > 0 ? `/dataset/${id}?information_request=${informationRequests.id}` : ""}
      >
        <InfoArrowIcon
          alt="pedidos Lai"
          width="15px"
          height="15px"
        />
        <Text
          marginLeft="4px !important"
          whiteSpace="nowrap"
        >
          {informationRequestsNumber}{" "}
          {informationRequestsNumber === 1 ? "pedido LAI" : "pedidos LAI"}
        </Text>
      </Text>
    )
  }

  return (
    <VStack
      justifyContent="space-between"
      alignItems="flex-start"
      width="100%"
      spacing={{ base: 4, md: 0 }}
    >
      <Stack
        direction={{ base: "column", lg: "row" }}
        alignItems="flex-start"
        width="100%"
        height="100%"
        spacing={6}
      >
        <Box
          as="a"
          href={`/dataset/${id}`}
          target="_self"
          display="flex"
          justifyContent="center"
          border="1px solid #DEDFE0"
          borderRadius="16px"
          _hover={{ opacity: 0.9 }}
        >
          <Image
            src={organization?.picture.startsWith("https://") ? organization?.picture : `https://basedosdados.org/uploads/group/${organization?.name}`}
            alt={organization.name || "Não informado"}
            borderRadius="16px"
            minWidth="222px"
            minHeight="138px"
            maxWidth="222px"
            maxHeight="138px"
            objectFit="contain"
          />
        </Box>

        <VStack
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={1}
          width="100%"
          minHeight="115px"
        >
          <VStack width="100%" spacing={1} alignItems="flex-start">
            <Stack
              direction={{ base: "column", lg: "row" }}
              width="100%"
              alignItems="flex-start"
              pb={{ base: 2, lg: 0 }}
            >
              <Text
                as="a"
                href={`/dataset/${id}`}
                width="100%"
                noOfLines={2}
                textOverflow="ellipsis"
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="18px"
                lineHeight="28px"
                color="#252A32"
                _hover={{
                  opacity: 0.7
                }}
              >
                {name}
              </Text>
            </Stack>

            <VStack
              width="100%"
              spacing="8px"
              marginBottom="4px !important"
              alignItems="flex-start"
            >
              <Stack
                direction={{ base: "column", lg: "row" }}
                spacing={1}
              >
                <Text
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#464A51"
                >
                  Organização:
                </Text>
                <Text
                  as="a"
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#71757A"
                  _hover={{
                    color: "#464A51"
                  }}
                  textOverflow="ellipsis"
                  href={`/dataset?organization=${organization?.slug}`}
                >
                  {organization?.name}
                </Text>
              </Stack>

              <Stack
                direction={{ base: "column", lg: "row" }}
                spacing={1}
              >
                <Text
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#464A51"
                >
                  Cobertura temporal:
                </Text>
                <Text
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#71757A"
                >
                  {temporalCoverageText ? temporalCoverageText : "Não informado"}
                </Text>
              </Stack>

              <Stack
                direction={{ base: "column", lg: "row" }}
                spacing={1}
              >
                <Text
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#464A51"
                >
                  Recursos:
                </Text>
                <Text
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#71757A"
                >
                  {contains.free && "Grátis"} {contains.free && contains.pro && "e"} {contains.pro && "Pagos"}
                  {!contains.free && !contains.pro && "Não informado"}
                </Text>
              </Stack>
            </VStack>
          </VStack>

          <HStack
            flexDirection={useCheckMobile() && "column"}
            alignItems={useCheckMobile() && "flex-start"}
            spacing={0}
            width="100%"
            maxWidth="440px"
            justifyContent="space-between"
          >
            <Tables/>
            <RawDataSources/>
            <InformationRequest/>
          </HStack>
        </VStack>
      </Stack>
    </VStack>
  );
}
