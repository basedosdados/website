import {
  Heading,
  HStack,
  Image,
  Stack,
  VStack,
  Flex,
  Center,
  Tooltip,
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
      spacing={{ base: 5, md: 0 }}
      padding="10px 0px"
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
              <HStack
                width="100%"
                alignItems="flex-start"
                pb={{ base: 4, lg: 0 }}
              >
                <Link width="100%" href={link}>
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
                <HStack
                  justifyContent={{ base: "flex-start", lg: "flex-end" }}
                  marginLeft="30px !important"
                  spacing={2}
                >
                  {categories.slice(0, Math.min(3, categories.length)).map((c) => (
                    <Tooltip
                      label={c[1]}
                      fontSize="16px"
                      fontWeight="500"
                      padding="5px 15px"
                      backgroundColor="#2A2F38"
                      marginTop="10px"
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
                      {organization.title}
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
              <HStack spacing={1}>
                <DataBaseIcon
                  solid={true}
                  widthIcon="15px"
                  heightIcon="15px"
                  fill={tableNum === 0 ? "#C4C4C4" : "#2B8C4D"}
                />
                <Subtitle
                  marginLeft="8px !important"
                  whiteSpace="nowrap"
                  color={tableNum === 0 ? "#C4C4C4" : "#2B8C4D"}
                  fontSize="15px"
                  fontWeight="500"
                >
                  {tableNum}{" "}
                  {tableNum === 1 ? "tabela tratada" : "tabelas tratadas"}
                </Subtitle>
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
