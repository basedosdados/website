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
    <Link width="100%" href={link}>
      <VStack
        paddingTop={{ base: "0px", md: "0px" }}
        paddingBottom={{ base: "50px", md: "0px" }}
        justifyContent="space-between"
        alignItems="flex-start"
        width="100%"
        spacing={{ base: 5, md: 0 }}
      >
        <HStack width="100%" spacing={10}>
          <Image
            priority
            objectFit="contain"
            width="91px"
            height="91px"
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
            height="91px"
          >
            <VStack width="100%" alignItems="flex-start">
              <Flex width="100%">
                <HStack maxWidth="600px" spacing={5}>
                  <Heading
                    fontWeight="700"
                    fontFamily="Lato"
                    fontSize="21px"
                    letterSpacing="0.05em"
                    color="#252A32"
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
                <HStack marginLeft="auto" spacing={3}>
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
                    <Box paddingRight="0px">
                      <CategoryIcon
                        size="39px"
                        url={`/_nxt/img/categories/icone_${c}${
                          isPlus ? "-1" : ""
                        }.svg`}
                      />
                    </Box>
                  ))}
                </HStack>
              </Flex>
              <VStack spacing={0} width="100%" alignItems="flex-start">
                <HStack fontSize="12px" spacing={5}>
                  <HStack>
                    <SectionText>Organização:</SectionText>
                    <SectionText fontWeight="bold">{organization}</SectionText>
                  </HStack>
                  <HStack>
                    <SectionText>Temas:</SectionText>
                    <SectionText fontWeight="bold">
                      {categoriesDisplay
                        .slice(0, Math.min(categoriesDisplay.length, 3))
                        .join(", ")}
                    </SectionText>
                  </HStack>
                </HStack>
                <HStack fontSize="12px" spacing={5}>
                  <HStack>
                    <SectionText>Abrangência:</SectionText>
                    <SectionText textTransform="capitalize" fontWeight="bold">
                      {(spatialCoverage || "Não definido").replace("_", " ")}
                    </SectionText>
                  </HStack>
                  <HStack>
                    <SectionText>Periocidade:</SectionText>
                    <SectionText textTransform="capitalize" fontWeight="bold">
                      {(updateFrequency || "Não definido").replace("_", " ")}
                    </SectionText>
                  </HStack>
                  <HStack>
                    <SectionText>Última Atualização:</SectionText>
                    <SectionText fontWeight="bold">
                      {new Date(updatedSince).toLocaleDateString("pt-BR")}
                    </SectionText>
                  </HStack>
                </HStack>
              </VStack>
            </VStack>
            <HStack>
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
              {databaseInfo.map((item, index) => (
                <>
                  <Subtitle fontSize="14px">{item}</Subtitle>{" "}
                  {index !== databaseInfo.length - 1 ? <Dot /> : <></>}{" "}
                </>
              ))}
            </HStack>
          </VStack>
        </HStack>
      </VStack>
    </Link>
  );
}
