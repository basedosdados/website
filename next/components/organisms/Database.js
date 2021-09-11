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
  children,
  updatedSince,
  updatedAuthor,
  organization,
  size,
  tableNum,
  externalLinkNum,
  stars,
  categories,
  categoriesDisplay,
  isPlus = false,
  link,
  spatialCoverage,
  updateFrequency,
}) {
  const databaseInfo = [];

  if (tableNum) databaseInfo.push(tableNum + " tabelas");
  if (externalLinkNum) databaseInfo.push(externalLinkNum + " link externo");

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
                {isPlus ? (
                  <Link href="/dataset?bdPlus=true">
                    <Image
                      paddingRight="10px"
                      priority
                      width="80px"
                      src="/img/logo_plus.png"
                    />
                  </Link>
                ) : (
                  <></>
                )}
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
                <HStack>
                  <SectionText color="#6F6F6F">Última Atualização:</SectionText>
                  <SectionText color="#6F6F6F" fontWeight="bold">
                    {new Date(updatedSince).toLocaleDateString("pt-BR")}
                  </SectionText>
                </HStack>
              </Stack>
            </VStack>
          </VStack>
          <VStack paddingTop="10px">
            <HStack spacing={5}>
              {tableNum ? (
                <HStack>
                  <Image src="/img/icons/database.svg" />
                  <Subtitle color="#2B8C4D" fontSize="15px" fontWeight="bold">
                    {tableNum} tabelas
                  </Subtitle>
                  {size ? (
                    <Subtitle color="#2B8C4D" fontSize="15px" fontWeight="bold">
                      ({Math.round(size / 1000)} mb)
                    </Subtitle>
                  ) : (
                    <></>
                  )}
                </HStack>
              ) : (
                <></>
              )}
              {externalLinkNum ? (
                <HStack>
                  <Image src="/img/icons/link.svg" />
                  <Subtitle color="#2B8C4D" fontSize="15px" fontWeight="bold">
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
