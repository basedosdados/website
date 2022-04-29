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
import { limitTextSize } from "../../utils";
import { CategoryIcon } from "../atoms/CategoryIcon";
import Title from "../atoms/Title";
import Link from "../atoms/Link";
import SectionText from "../atoms/SectionText";
import DataBaseIcon from "../../public/img/icons/databaseIcon";
import LinkIcon from "../../public/img/icons/linkIcon";
import InfoIcon from "../../public/img/icons/infoIcon";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import BDLogoPlusImage from "../../public/img/logos/bd_logo_plus";

export function Database({
  image,
  name,
  organization,
  size,
  tableNum,
  externalLinkNum,
  informationRequestNum,
  categories,
  isPlus = false,
  temporalCoverage,
  link,
}) {
  const isMobile = useCheckMobile()
  let sizeLabel;

  if (size) {
    if (size < 1000000) sizeLabel = Math.round(size / 1024) + " kb";
    else if (size >= 1000000)
      sizeLabel = Math.round(size / (1024 * 1024)) + " mb";
    else sizeLabel = Math.round(size / (1024 * 1024 * 1024)) + " gb";
  }

  function getTemporalCoverage() {

    if (temporalCoverage.length === 0 || !temporalCoverage) return "Não listado";

    var years = [];
    for (let i = 0; i < temporalCoverage.length; i++) {
      var interval = temporalCoverage[i];
      if (interval.includes("(")) {
        var first = interval.substring(0, interval.indexOf('('));
        var last = interval.substring(interval.indexOf(')') + 1);
        years.push(first);
        years.push(last);
      }
      else {
        years.push(interval);
      }

    }

    var years = years.sort();

    if (years.length === 1) return years[0];

    var min_date = years[0];
    var max_date = years[years.length - 1];

    return (min_date + " - " + max_date);

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
        <Link _hover={{opacity:"none"}} href={link}>
          <Image
            priority
            objectFit="contain"
            maxWidth="115px"
            maxHeight="115px"
            minWidth="115px"
            minHeight="115px"
            borderRadius="10px"
            filter="drop-shadow(0px 2px 3px rgba(100, 96, 103, 0.16));"
            src={image}
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
                <Link width="100%" href={link}>
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
                  margin={isMobile ? "16px 0px 0px !important" : "0px 0px 0px 28px !important"}
                  spacing={2}
                >
                  {categories.slice(0, Math.min(3, categories.length)).map((c) => (
                    <Tooltip
                      hasArrow
                      label={c[1]}
                      fontSize="16px"
                      fontWeight="500"
                      padding="5px 16px 6px"
                      backgroundColor="#2A2F38"
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
                        <Link filter="invert(1)" _hover={{ opacity: "none" }} href={`/dataset?group=${c[0]}`}>
                          <CategoryIcon
                            size="36px"
                            url={`https://basedosdados-static.s3.us-east-2.amazonaws.com/category_icons/2022/icone_${c[0]}.svg`}
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
                  <Link href={`/dataset?organization=${organization.name}`}>
                    <SectionText
                      color="#6F6F6F"
                      fontWeight="400"
                      noOfLines={1}
                      textOverflow="ellipsis"
                    >
                      {organization.title}
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
                  <SectionText color="#6F6F6F" fontWeight="400">
                    {getTemporalCoverage()}
                  </SectionText>
                </HStack>
              </Stack>
            </VStack>
          </VStack>
          <VStack>
            <HStack
              flexDirection={isMobile && "column"}
              alignItems={isMobile && "flex-start"}
              spacing={isMobile ? 0 : 5}
            >
              <HStack spacing={1}>
                <DataBaseIcon
                  solid={true}
                  widthIcon="15px"
                  heightIcon="15px"
                  fill={tableNum === 0 ? "#C4C4C4" : "#2B8C4D"}
                />
                <Text
                  marginLeft="8px !important"
                  whiteSpace="nowrap"
                  color={tableNum === 0 ? "#C4C4C4" : "#2B8C4D"}
                  fontSize="16px"
                  fontWeight="500"
                  letterSpacing="0px"
                  fontFamily="Ubuntu"
                >
                  {tableNum}{" "}
                  {tableNum === 1 ? "tabela tratada" : "tabelas tratadas"}
                </Text>
                <BDLogoPlusImage
                  widthImage="38px"
                  empty={tableNum === 0}
                />
              </HStack>

              <HStack>
                <LinkIcon
                  widthIcon="15px"
                  heightIcon="15px"
                  fill={externalLinkNum === 0 ? "#C4C4C4" : "#2B8C4D"}
                />
                <Text
                  color={externalLinkNum === 0 ? "#C4C4C4" : "#2B8C4D"}
                  fontSize="16px"
                  fontWeight="500"
                  letterSpacing="0px"
                  fontFamily="Ubuntu"
                >
                  {externalLinkNum}{" "}
                  {externalLinkNum === 1 ? "fonte original" : "fontes originais"}
                </Text>
              </HStack>

              <HStack>
                <InfoIcon
                  widthIcon="15px"
                  heightIcon="15px"
                  fill={informationRequestNum === 0 ? "#C4C4C4" : "#2B8C4D"}
                />
                <Text
                  color={informationRequestNum === 0 ? "#C4C4C4" : "#2B8C4D"}
                  fontSize="16px"
                  fontWeight="500"
                  letterSpacing="0px"
                  fontFamily="Ubuntu"
                >
                  {informationRequestNum}{" "}
                  {informationRequestNum === 1 ? "pedido LAI" : "pedidos LAI"}
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </VStack>
      </Stack>
    </VStack>
  );
}
