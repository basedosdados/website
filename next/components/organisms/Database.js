import {
  Heading,
  HStack,
  Image,
  Stack,
  VStack,
  Flex,
  Text,
  Center,
  Tooltip,
} from "@chakra-ui/react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import { CategoryIcon } from "../atoms/CategoryIcon";
import Title from "../atoms/Title";
import Link from "../atoms/Link";
import SectionText from "../atoms/SectionText";
import { TemporalCoverageString } from "../molecules/TemporalCoverageDisplay";

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
  themes = [],
}) {

  const Tables = () => {
    let tablesNumber = tables.number
    if(tables.number === undefined) tablesNumber = 0

    return (
      <a href={tablesNumber > 0 ? `/dataset/${id}?table=${tables.id}` : ""}>
        <HStack
          spacing={1}
          cursor={tablesNumber > 0 ? "pointer" : "normal"}
          _hover={tablesNumber > 0 && {opacity: "0.7"}}
        >
          <DataBaseSolidIcon
            alt="tabelas tratadas"
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
            {tablesNumber}{" "}
            {tablesNumber === 1 ? "tabela tratada" : "tabelas tratadas"}
          </Text>
        </HStack>
      </a>
    )
  }

  const RawDataSources = () => {
    let rawDataSourcesNumber = rawDataSources.number
    if(rawDataSources.number === undefined) rawDataSourcesNumber = 0

    return (
      <a href={rawDataSourcesNumber > 0 ? `/dataset/${id}?raw_data_source=${rawDataSources.id}` : ""}>
        <HStack
          cursor={rawDataSourcesNumber > 0 ? "pointer" : "normal"}
          _hover={rawDataSourcesNumber > 0 && {opacity: "0.7"}}
        >
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
            {rawDataSourcesNumber}{" "}
            {rawDataSourcesNumber === 1 ? "fonte original" : "fontes originais"}
          </Text>
        </HStack>
      </a>
    )
  }

  const InformationRequest = () => {
    let informationRequestsNumber = informationRequests.number
    if(informationRequests.number === undefined) informationRequestsNumber = 0

    return (
      <a href={informationRequestsNumber > 0 ? `/dataset/${id}?information_request=${informationRequests.id}` : ""}>
        <HStack
          cursor={informationRequestsNumber > 0 ? "pointer" : "normal"}
          _hover={informationRequestsNumber > 0 && {opacity: "0.7"}}
        >
          <InfoArrowIcon
            alt="pedidos Lai"
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
            {informationRequestsNumber}{" "}
            {informationRequestsNumber === 1 ? "pedido LAI" : "pedidos LAI"}
          </Text>
        </HStack>
      </a>
    )
  }

  return (
    <VStack
      justifyContent="space-between"
      alignItems="flex-start"
      width="100%"
      spacing={{ base: 4, md: 0 }}
      padding="16px 0px"
    >
      <Stack
        direction={{ base: "column", lg: "row" }}
        alignItems="flex-start"
        width="100%"
        height="100%"
        spacing={6}
      >
        <Link _hover={{opacity:"none"}}>
          <Image
            src={organization?.picture.startsWith("https://") ? organization?.picture : `https://basedosdados.org/uploads/group/${organization?.name}`}
            alt={organization.name || "Não informado"}
            borderRadius="16px"
            boxShadow="0px 4px 8px rgba(100, 96, 103, 0.16)"
            maxWidth="138px"
            maxHeight="138px"
            minWidth="138px"
            minHeight="138px"
            backgroundColor="#eee"
            objectFit="contain"
          />
        </Link>
        <VStack
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={1}
          width="100%"
          minHeight="115px"
        >
          <VStack width="100%" spacing={1} alignItems="flex-start">
            <Flex
              position="relative"
              flexDir={{ base: "column", lg: "row" }}
              justifyContent="center"
              alignItems="flex-start"
              width="100%"
            >
              <Stack
                direction={{ base: "column", lg: "row" }}
                width="100%"
                alignItems="flex-start"
                pb={{ base: 2, lg: 0 }}
              >
                <Link width="100%" href={`/dataset/${id}`}>
                  <Title
                    margin="0px"
                    padding="0px"
                    noOfLines={2}
                    textOverflow="ellipsis"
                  >
                    {name}
                  </Title>
                </Link>
                <HStack
                  justifyContent={{ base: "flex-start", lg: "flex-end" }}
                  margin={useCheckMobile() ? "16px 0px 0px !important" : "0px 0px 0px 28px !important"}
                  height="36px"
                  spacing={2}
                >
                  {themes.slice(0,6).map((elm, i) => (
                    <Tooltip
                      key={i}
                      hasArrow
                      bg="#2A2F38"
                      label={elm.name}
                      fontSize="16px"
                      fontWeight="500"
                      padding="5px 16px 6px"
                      color="#FFF"
                      borderRadius="6px"
                    >
                      <Center
                        width="36px"
                        height="36px"
                        backgroundColor="#2B8C4D"
                        padding="4px"
                        borderRadius="6px"
                      >
                        <Link filter="invert(1)" _hover={{ opacity: "none" }} href={`/dataset?theme=${elm.slug}`}>
                          <CategoryIcon
                            alt={elm.name}
                            size="36px"
                            url={`https://storage.googleapis.com/basedosdados-website/category_icons/2022/icone_${elm.slug}.svg`}
                          />
                        </Link>
                      </Center>
                    </Tooltip>
                  ))}
                </HStack>
              </Stack>
            </Flex>
            <VStack spacing={0} width="100%" alignItems="flex-start">
              <Stack
                direction={{ base: "column", lg: "row" }}
                spacing={{ base: 0, lg: 5 }}
              >
                <HStack pb={{ base: 1, lg: 0 }}>
                  <SectionText color="#6F6F6F">Organização:</SectionText>
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
                  <SectionText color="#6F6F6F">Cobertura temporal:</SectionText>
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
                  <SectionText color="#6F6F6F">Recursos:</SectionText>
                  <SectionText
                      color="#6F6F6F"
                      fontWeight="400"
                      noOfLines={1}
                      textOverflow="ellipsis"
                    >
                      {contains.free && "Grátis"} {contains.free && contains.pro && "e"} {contains.pro && "Pro"}
                      {!contains.free && !contains.pro && "Não listado"}
                    </SectionText>
                </HStack>
              </Stack>
            </VStack>
          </VStack>
          <VStack>
            <HStack
              flexDirection={useCheckMobile() && "column"}
              alignItems={useCheckMobile() && "flex-start"}
              spacing={useCheckMobile() ? 0 : 5}
            >
              <Tables/>
              <RawDataSources/>
              <InformationRequest/>
            </HStack>
          </VStack>
        </VStack>
      </Stack>
    </VStack>
  );
}
