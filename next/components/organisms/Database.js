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
      <HStack alignItems="flex-start" width="100%" spacing={10}>
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
        <VStack
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={1}
          width="100%"
        >
          <VStack width="100%" spacing={1} alignItems="flex-start">
            <Flex justifyContent="center" alignItems="flex-start" width="100%">
              <HStack
                justifyContent="center"
                alignItems="flex-start"
                spacing={5}
                pt={1}
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
                    maxWidth="500px"
                    minWidth="100px"
                  >
                    {name}
                  </Heading>
                </Link>
                <HStack
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
                </HStack>
              </HStack>
              <HStack
                alignItems="flex-start"
                justifyContent="flex-start"
                marginLeft="auto"
                spacing={2}
              >
                {isPlus ? (
                  <Image
                    paddingRight="10px"
                    priority
                    width="80px"
                    src="/_nxt/img/logo_plus.png"
                  />
                ) : (
                  <></>
                )}
                {categories.map((c) => (
                  <Link href={`/_nxt/search?group=${c}`}>
                    <CategoryIcon
                      size="36px"
                      url={`/_nxt/img/categories/icone_${c}${
                        isPlus ? "-1" : ""
                      }.svg`}
                    />
                  </Link>
                ))}
              </HStack>
            </Flex>
            <VStack spacing={0} width="100%" alignItems="flex-start">
              <HStack fontSize="12px" spacing={5}>
                <HStack>
                  <SectionText color="#6F6F6F">Organização:</SectionText>
                  <Link href={`/_nxt/search?organization=${organization.name}`}>
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
              </HStack>
              <HStack fontSize="12px" spacing={5}>
                <HStack>
                  <SectionText color="#6F6F6F">Abrangência:</SectionText>
                  <SectionText
                    color="#6F6F6F"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {spatialCoverage || "Não definido"}
                  </SectionText>
                </HStack>
                <HStack>
                  <SectionText color="#6F6F6F">Periocidade:</SectionText>
                  <SectionText
                    color="#6F6F6F"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {updateFrequency || "Não definido"}
                  </SectionText>
                </HStack>
                <HStack>
                  <SectionText color="#6F6F6F">Última Atualização:</SectionText>
                  <SectionText color="#6F6F6F" fontWeight="bold">
                    {new Date(updatedSince).toLocaleDateString("pt-BR")}
                  </SectionText>
                </HStack>
              </HStack>
            </VStack>
          </VStack>
          <VStack paddingTop="10px">
            <HStack spacing={5}>
              {tableNum ? (
                <HStack>
                  <Image src="/_nxt/img/icons/database.svg" />
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
                  <Image src="/_nxt/img/icons/link.svg" />
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
      </HStack>
    </VStack>
  );
}
