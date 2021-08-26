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
    >
      <HStack alignItems="flex-start" width="100%" spacing={10}>
        <Image
          priority
          objectFit="contain"
          maxWidth="91px"
          maxHeight="91px"
          minWidth="91px"
          minHeight="91px"
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
                spacing={3}
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
                  <CategoryIcon
                    size="36px"
                    url={`/_nxt/img/categories/icone_${c}${
                      isPlus ? "-1" : ""
                    }.svg`}
                  />
                ))}
              </HStack>
            </Flex>
            <VStack spacing={0} width="100%" alignItems="flex-start">
              <HStack fontSize="12px" spacing={5}>
                <HStack>
                  <SectionText color="#6F6F6F">Organização:</SectionText>
                  <SectionText
                    color="#6F6F6F"
                    textAlign="left"
                    lineHeight="15px"
                    fontWeight="bold"
                  >
                    {limitTextSize(organization, 30)}
                  </SectionText>
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
            <HStack>
              <HStack>
                <Image src="/_nxt/img/icons/database.svg" />
                {size ? (
                  <>
                    <Subtitle fontSize="14px" fontWeight="bold">
                      {Math.round(size / 1000)} mb
                    </Subtitle>
                    <Dot />
                  </>
                ) : (
                  <></>
                )}
              </HStack>
              {databaseInfo.map((item, index) => (
                <>
                  <Subtitle fontSize="14px">{item}</Subtitle>{" "}
                  {index !== databaseInfo.length - 1 ? <Dot /> : <></>}{" "}
                </>
              ))}
            </HStack>
          </VStack>
        </VStack>
      </HStack>
    </VStack>
  );
}
