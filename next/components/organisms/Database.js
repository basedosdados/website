import {
  Heading,
  HStack,
  Image,
  Stack,
  VStack,
  Text,
  Flex,
  Box,
} from "@chakra-ui/react";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { limitTextSize } from "../../utils";
import { CategoryIcon } from "../atoms/CategoryIcon";
import { Dot } from "../atoms/Dot";
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
              flexDir={{ base: "column", lg: "row" }}
              justifyContent="center"
              alignItems="flex-start"
              width="100%"
            >
              <HStack
                justifyContent="center"
                alignItems="flex-start"
                spacing={5}
                pb={{ base: 4, lg: 0 }}
              >
                <Link href={link}>
                  <Heading
                    margin="0px"
                    padding="0px"
                    fontWeight="700"
                    fontFamily="Lato"
                    fontSize="18px"
                    letterSpacing="0.1em"
                    color="#252A32"
                  >
                    {name}
                  </Heading>
                </Link>
                {/*<HStack
                  borderRadius="10.5233px"
                  border="0.743243px solid #6F6F6F"
                  padding="2px 7px"
                  alignItems="center"
                  height="20px"
                  marginLeft="10px"
                  spacing={1}
                >
                  <FontAwesomeIcon style={{ width: "10px" }} icon={faStar} />
                  <Heading fontFamily="Lato" fontSize="14px">
                    {stars || 0}
                  </Heading>
                </HStack>*/}
              </HStack>
              <HStack
                justifyContent={{ base: "flex-start", lg: "flex-end" }}
                marginLeft="auto"
                spacing={2}
                pb={{ base: 3, lg: 0 }}
                width="100%"
              >
                {categories.map((c) => (
                  <Link href={`/dataset?group=${c}`}>
                    <CategoryIcon
                      size="36px"
                      url={`/img/categories/icone_${c}${
                        isPlus ? "-1" : ""
                      }.svg`}
                    />
                  </Link>
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
                    {temporalCoverage[0]} -{" "}
                    {temporalCoverage[temporalCoverage.length - 1]}
                  </SectionText>
                </HStack>
              </Stack>
            </VStack>
          </VStack>
          <VStack paddingTop="10px">
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
                  {tableNum} tabelas tratadas{" "}
                </Subtitle>
                <Link href="/dataset?bdPlus=true">
                  <Image
                    height="15px"
                    src={
                      tableNum === 0
                        ? "/img/logos/bd_plus_cinza.png"
                        : "/img/logo_plus.png"
                    }
                  />
                </Link>
                {size ? (
                  <Subtitle
                    color={tableNum === 0 ? "#6F6F6F" : "#2B8C4D"}
                    fontSize="15px"
                    fontWeight="bold"
                  >
                    ({sizeLabel})
                  </Subtitle>
                ) : (
                  <></>
                )}
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
                    {externalLinkNum} links externos
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
