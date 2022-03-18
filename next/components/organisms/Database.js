import {
  Heading,
  HStack,
  Image,
  Stack,
  VStack,
  Flex,
  Center,
} from "@chakra-ui/react";
import { limitTextSize } from "../../utils";
import { CategoryIcon } from "../atoms/CategoryIcon";
import Link from "../atoms/Link";
import SectionText from "../atoms/SectionText";
import Subtitle from "../atoms/Subtitle";
import DataBaseIcon from "../../public/img/icons/databaseIcon";
import LinkIcon from "../../public/img/icons/linkIcon";
import InfoIcon from "../../public/img/icons/infoIcon";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

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

    if (temporalCoverage.length === 0 || !temporalCoverage) return "";

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
      spacing={{ base: 5, md: 0 }}
      padding="10px 0px"
    >
      <Stack
        direction={{ base: "column", lg: "row" }}
        alignItems="flex-start"
        width="100%"
        spacing={10}
      >
        <Link _hover={{opacity:"none"}} href={link}>
          <Image
            priority
            objectFit="contain"
            maxWidth="105px"
            maxHeight="105px"
            minWidth="105px"
            minHeight="105px"
            borderRadius="10.1111px"
            filter="drop-shadow(0px 2.02222px 2.02222px rgba(0, 0, 0, 0.25));"
            src={image}
            backgroundColor="#eee"
          />
        </Link>
        <VStack
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={1}
          width="100%"
        >
          <VStack width="100%" spacing={1} alignItems="flex-start">
            <Flex
              position="relative"
              flexDir={{ base: "column", lg: "row" }}
              justifyContent="center"
              alignItems="flex-start"
              width="100%"
            >
              <HStack
                width="100%"
                alignItems="flex-start"
                pb={{ base: 4, lg: 0 }}
              >
                <Link href={link}>
                  <Heading
                    margin="0px"
                    padding="0px"
                    fontWeight="700"
                    fontFamily="Ubuntu"
                    fontSize="18px"
                    letterSpacing="0.5px"
                    color="#252A32"
                  >
                    {name}
                  </Heading>
                </Link>
              </HStack>
              <HStack
                position="absolute"
                top={isMobile ? "-120px" :"-12px"}
                right="0"
                justifyContent={{ base: "flex-start", lg: "flex-end" }}
                spacing={2}
              >
                {categories.slice(0, Math.min(3, categories.length)).map((c) => (
                  <Center
                    width="36px" 
                    height="36px" 
                    backgroundColor="#2B8C4D" 
                    borderRadius="6px"
                  >
                    <Link filter="invert(1)" _hover={{ opacity: "none" }} href={`/dataset?group=${c}`}>
                      <CategoryIcon
                        size="36px"
                        url={`https://basedosdados-static.s3.us-east-2.amazonaws.com/category_icons/icone_${c}.svg`}
                      />
                    </Link>
                  </Center>
                ))}
              </HStack>
            </Flex>
            <VStack spacing={0} width="100%" alignItems="flex-start">
              <Stack
                direction={{ base: "column", lg: "row" }}
                fontSize="12px"
                spacing={{ base: 0, lg: 5 }}
              >
                <HStack>
                  <SectionText color="#6F6F6F">Organização:</SectionText>
                  <Link href={`/dataset?organization=${organization.name}`}>
                    <SectionText
                      color="#6F6F6F"
                      textAlign="left"
                      lineHeight="15px"
                      fontWeight="bold"
                      fontSize="14px"
                    >
                      {limitTextSize(organization.title, 30)}
                    </SectionText>
                  </Link>
                </HStack>
              </Stack>
              <Stack
                direction={{ base: "column", lg: "row" }}
                fontSize="12px"
                spacing={{ base: 0, lg: 5 }}
              >
                <HStack spacing={2} align="flex-start">
                  <SectionText color="#6F6F6F">Cobertura temporal:</SectionText>
                  <SectionText color="#6F6F6F" fontWeight="bold">
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
              <HStack>
                <DataBaseIcon
                  solid={true}
                  widthIcon="15px"
                  heightIcon="15px"
                  fill={tableNum === 0 ? "#C4C4C4" : "#2B8C4D"}
                />
                <Subtitle
                  whiteSpace="nowrap"
                  color={tableNum === 0 ? "#C4C4C4" : "#2B8C4D"}
                  fontSize="15px"
                  fontWeight="500"
                >
                  {tableNum}{" "}
                  {tableNum === 1 ? "tabela tratada" : "tabelas tratadas"}
                </Subtitle>
                <Image
                  height="15px"
                  src={
                    tableNum === 0
                      ? "/img/logos/bd_plus_cinza.png"
                      : "/img/logo_plus.png"
                  }
                />
              </HStack>

              <HStack>
                <LinkIcon 
                  widthIcon="15px"
                  heightIcon="15px"
                  fill={externalLinkNum === 0 ? "#C4C4C4" : "#2B8C4D"}
                />
                <Subtitle
                  color={externalLinkNum === 0 ? "#C4C4C4" : "#2B8C4D"}
                  fontSize="15px"
                  fontWeight="500"
                >
                  {externalLinkNum}{" "}
                  {externalLinkNum === 1 ? "fonte original" : "fontes originais"}
                </Subtitle>
              </HStack>
              
              <HStack>
                <InfoIcon 
                  widthIcon="15px"
                  heightIcon="15px"
                  fill={informationRequestNum === 0 ? "#C4C4C4" : "#2B8C4D"}
                />
                <Subtitle
                  color={informationRequestNum === 0 ? "#C4C4C4" : "#2B8C4D"}
                  fontSize="15px"
                  fontWeight="500"
                >
                  {informationRequestNum}{" "}
                  {informationRequestNum === 1 ? "pedido LAI" : "pedidos LAI"}
                </Subtitle>
              </HStack>
            </HStack>
          </VStack>
        </VStack>
      </Stack>
    </VStack>
  );
}
