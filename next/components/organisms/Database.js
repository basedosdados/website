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
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation('dataset')

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
<<<<<<< HEAD
          <DataBaseSolidIcon
            alt={t("processed tables")}
            width="15px"
            height="15px"
            fill={tablesNumber === 0 ? "#C4C4C4" : "#2B8C4D"}
          />
          <Text
            marginLeft="8px !important"
            whiteSpace="nowrap"
            color={tablesNumber === 0 ? "#C4C4C4" : "#2B8C4D"}
            fontSize="16px"
            fontWeight="500"
            letterSpacing="0px"
            fontFamily="Ubuntu"
          >
            {t("{{count}} processed table", {count: tablesNumber})}
          </Text>
        </HStack>
      </a>
=======
          {tablesNumber}{" "}
          {tablesNumber === 1 ? "tabela tratada" : "tabelas tratadas"}
        </Text>
      </Text>
>>>>>>> main
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
<<<<<<< HEAD
          <LinkIcon
            width="15px"
            height="15px"
            fill={rawDataSourcesNumber === 0 ? "#C4C4C4" : "#2B8C4D"}
          />
          <Text
            color={rawDataSourcesNumber === 0 ? "#C4C4C4" : "#2B8C4D"}
            fontSize="16px"
            fontWeight="500"
            letterSpacing="0px"
            fontFamily="Ubuntu"
          >
            {t("{{count}} original source", {count: rawDataSourcesNumber})}
          </Text>
        </HStack>
      </a>
=======
          {rawDataSourcesNumber}{" "}
          {rawDataSourcesNumber === 1 ? "fonte original" : "fontes originais"}
        </Text>
      </Text>
>>>>>>> main
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
<<<<<<< HEAD
          <InfoArrowIcon
            alt={t("LAI requests")}
            width="15px"
            height="15px"
            fill={informationRequestsNumber === 0 ? "#C4C4C4" : "#2B8C4D"}
          />
          <Text
            color={informationRequestsNumber === 0 ? "#C4C4C4" : "#2B8C4D"}
            fontSize="16px"
            fontWeight="500"
            letterSpacing="0px"
            fontFamily="Ubuntu"
          >
            {t("{{count}} LAI request", {count: informationRequestsNumber})}
          </Text>
        </HStack>
      </a>
=======
          {informationRequestsNumber}{" "}
          {informationRequestsNumber === 1 ? "pedido LAI" : "pedidos LAI"}
        </Text>
      </Text>
>>>>>>> main
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
<<<<<<< HEAD
                <HStack pb={{ base: 1, lg: 0 }}>
                  <SectionText color="#6F6F6F">{t("Organization")}:</SectionText>
                  <Link href={`/dataset?organization=${organization?.slug}`}>
                    <SectionText
                      color="#6F6F6F"
                      fontWeight="400"
                      noOfLines={1}
                      textOverflow="ellipsis"
                    >
                      {organization?.name}
                    </SectionText>
                  </Link>
                </HStack>
=======
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
>>>>>>> main
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
<<<<<<< HEAD
                  <SectionText color="#6F6F6F">{t("Temporal coverage")}:</SectionText>
                  <TemporalCoverageString
                    value={ temporalCoverageText ? temporalCoverageText : ""}
                    textSettings={{color: "#6F6F6F", fontWeight:"400"}}
                  />
                </HStack>
              </Stack>
              <Stack
                direction={{ base: "column", lg: "row" }}
                spacing={{ base: 0, lg: 5 }}
              >
                <HStack
                  spacing={2}
                  align="flex-start"
                  pb={{ base: 1, lg: 0 }}
                >
                  <SectionText color="#6F6F6F">{t("Resources")}:</SectionText>
                  <SectionText
                      color="#6F6F6F"
                      fontWeight="400"
                      noOfLines={1}
                      textOverflow="ellipsis"
                    >
                      {contains.free && t("Free")} {contains.free && contains.pro && t("and")} {contains.pro && t("Pro")}
                      {!contains.free && !contains.pro && t("Not listed")}
                    </SectionText>
                </HStack>
=======
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
>>>>>>> main
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
