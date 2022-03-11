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

export function Database({
  image,
  name,
  organization,
  size,
  tableNum,
  externalLinkNum,
  categories,
  categoriesDisplay,
  isPlus = false,
  temporalCoverage,
  link,
}) {
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
        <Link href={link}>
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
                    fontFamily="Lato"
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
                top="0"
                right="0"
                justifyContent={{ base: "flex-start", lg: "flex-end" }}
                spacing={2}
                width="100%"
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
                      fontSize="12px"
                    >
                      {limitTextSize(organization.title, 30)}
                    </SectionText>
                  </Link>
                </HStack>
                <HStack>
                  <SectionText color="#6F6F6F">Temas:</SectionText>
                  <SectionText
                    color="#6F6F6F"
                    textAlign="left"
                    lineHeight="15px"
                    fontWeight="bold"
                  >
                    {limitTextSize(
                      categoriesDisplay
                        .slice(0, Math.min(categoriesDisplay.length, 3))
                        .join(", "),
                      30
                    )}
                  </SectionText>
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
            <HStack spacing={5}>
              <HStack>
                <Image
                  height="15px"
                  src={
                    tableNum === 0
                      ? "/img/icons/database_disabled.png"
                      : "/img/icons/database.png"
                  }
                />
                <Subtitle
                  whiteSpace="nowrap"
                  color={tableNum === 0 ? "#6F6F6F" : "#2B8C4D"}
                  fontSize="15px"
                  fontWeight="bold"
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
              {externalLinkNum ? (
                <HStack>
                  <Image
                    height="15px"
                    src={
                      tableNum === 0
                        ? "/img/icons/link_disabled.png"
                        : "/img/icons/link.png"
                    }
                  />
                  <Subtitle
                    color={tableNum === 0 ? "#6F6F6F" : "#2B8C4D"}
                    fontSize="15px"
                    fontWeight="bold"
                  >
                    {externalLinkNum}{" "}
                    {externalLinkNum === 1 ? "fonte original" : "fontes originais"}
                  </Subtitle>
                </HStack>
              ) : (
                <></>
              )}
            </HStack>
          </VStack>
        </VStack>
      </Stack>
    </VStack>
  );
}
