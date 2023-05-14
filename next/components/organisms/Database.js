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
import { ImageOrganization } from "../atoms/ImageOrganization";
import TemporalCoverage from "../atoms/TemporalCoverageDisplay";

import LinkIcon from "../../public/img/icons/linkIcon";
import InfoArrowIcon from "../../public/img/icons/infoArrowIcon";
import BDLogoPlusImage from "../../public/img/logos/bd_logo_plus";
import { DataBaseSolidIcon } from "../../public/img/icons/databaseIcon";

export function Database({
  id,
  name,
  organization,
  tables,
  rawDataSources,
  informationRequests,
  themes = [],
}) {

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
          <ImageOrganization
            title={organization.name}
            image={organization.image}
            maxWidth="115px"
            maxHeight="115px"
            minWidth="115px"
            minHeight="115px"
            borderRadius="10px"
            backgroundColor="#eee"
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
                  spacing={2}
                >
                  {themes.map((elm) => (
                    <Tooltip
                      hasArrow
                      bg="#2A2F38"
                      label={elm[1]}
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
                        <Link filter="invert(1)" _hover={{ opacity: "none" }} href={`/dataset?group=${elm[0]}`}>
                          <CategoryIcon
                            alt={elm[0]}
                            size="36px"
                            url={`https://basedosdados-static.s3.us-east-2.amazonaws.com/category_icons/2022/icone_${elm[0]}.svg`}
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
                  <Link href={`/dataset?organization=${organization?.name}`}>
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
                  <TemporalCoverage
                    text="Nenhuma cobertura temporal fornecida"
                    textSettings={{color: "#6F6F6F", fontWeight:"400"}}
                  />
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
              <a href={tables.number > 0 && `/dataset/${id}?table=${tables.id}`}>
                <HStack
                  spacing={1}
                  cursor={tables.number > 0 ? "pointer" : "normal"}
                  _hover={tables.number > 0 && {opacity: "0.7"}}
                >
                  <DataBaseSolidIcon
                    alt="tabelas tratadas"
                    width="15px"
                    height="15px"
                    fill={tables.number === 0 ? "#C4C4C4" : "#2B8C4D"}
                  />
                  <Text
                    marginLeft="8px !important"
                    whiteSpace="nowrap"
                    color={tables.number === 0 ? "#C4C4C4" : "#2B8C4D"}
                    fontSize="16px"
                    fontWeight="500"
                    letterSpacing="0px"
                    fontFamily="Ubuntu"
                  >
                    {tables.number}{" "}
                    {tables.number === 1 ? "tabela tratada" : "tabelas tratadas"}
                  </Text>
                  <BDLogoPlusImage
                    widthImage="38px"
                    empty={tables.number === 0}
                  />
                </HStack>
              </a>
              
              <a href={rawDataSources.number > 0 && `/dataset/${id}?raw_data_source=${rawDataSources.id}`}>
                <HStack
                  cursor={rawDataSources.number > 0 ? "pointer" : "normal"}
                  _hover={rawDataSources.number > 0 && {opacity: "0.7"}}
                >
                  <LinkIcon
                    width="15px"
                    height="15px"
                    fill={rawDataSources.number === 0 ? "#C4C4C4" : "#2B8C4D"}
                  />
                  <Text
                    color={rawDataSources.number === 0 ? "#C4C4C4" : "#2B8C4D"}
                    fontSize="16px"
                    fontWeight="500"
                    letterSpacing="0px"
                    fontFamily="Ubuntu"
                  >
                    {rawDataSources.number}{" "}
                    {rawDataSources.number === 1 ? "fonte original" : "fontes originais"}
                  </Text>
                </HStack>
              </a>

              <a href={informationRequests.number > 0 && `/dataset/${id}?information_request=${informationRequests.id}`}>
                <HStack
                  cursor={informationRequests.number > 0 ? "pointer" : "normal"}
                  _hover={informationRequests.number > 0 && {opacity: "0.7"}}
                >
                  <InfoArrowIcon
                    alt="pedidos Lai"
                    width="15px"
                    height="15px"
                    fill={informationRequests.number === 0 ? "#C4C4C4" : "#2B8C4D"}
                  />
                  <Text
                    color={informationRequests.number === 0 ? "#C4C4C4" : "#2B8C4D"}
                    fontSize="16px"
                    fontWeight="500"
                    letterSpacing="0px"
                    fontFamily="Ubuntu"
                  >
                    {informationRequests.number}{" "}
                    {informationRequests.number === 1 ? "pedido LAI" : "pedidos LAI"}
                  </Text>
                </HStack>
              </a>
            </HStack>
          </VStack>
        </VStack>
      </Stack>
    </VStack>
  );
}
