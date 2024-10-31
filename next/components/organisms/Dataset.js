import {
  HStack,
  Image,
  Stack,
  VStack,
  Text,
  Box
} from "@chakra-ui/react";
import { useTranslation } from 'next-i18next';
import { capitalize } from "lodash";
import { useRouter } from 'next/router';
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import Link from '../atoms/Link';

import LinkIcon from "../../public/img/icons/linkIcon";
import InfoArrowIcon from "../../public/img/icons/infoArrowIcon";
import { DataBaseSolidIcon } from "../../public/img/icons/databaseIcon";

export default function Dataset({
  id,
  name,
  temporalCoverageText,
  organization,
  tables,
  rawDataSources,
  informationRequests,
  contains,
  locale
}) {
  const { t } = useTranslation('dataset');
  const router = useRouter();

  const Tables = () => {
    let tablesNumber = tables.number
    if(tables.number === undefined) tablesNumber = 0

    return (
      <Link
        href={tablesNumber > 0 ? `/dataset/${id}?table=${tables.id}` : "#"}
        cursor={tablesNumber > 0 ? "pointer" : "normal"}
        color={tablesNumber === 0 ? "#ACAEB1" : "#0068C5"}
        fill={tablesNumber === 0 ? "#ACAEB1" : "#0068C5"}
        pointerEvents={tablesNumber === 0 && "none"}
        fontWeight="400"
        _hover={{
          color: "#0057A4",
          fill: "#0057A4"
        }}
      >
        <DataBaseSolidIcon
          alt={t('tables')}
          width="15px"
          height="15px"
        />
        <Text
          marginLeft="4px !important"
          whiteSpace="nowrap"
        >
          {tablesNumber}{" "}
          {tablesNumber === 1 ? t('datasetCard.table') : t('datasetCard.tables')}
        </Text>
      </Link>
    )
  }

  const RawDataSources = () => {
    let rawDataSourcesNumber = rawDataSources.number
    if(rawDataSources.number === undefined) rawDataSourcesNumber = 0

    return (
      <Link
        cursor={rawDataSourcesNumber > 0 ? "pointer" : "normal"}
        color={rawDataSourcesNumber === 0 ? "#ACAEB1" : "#0068C5"}
        fill={rawDataSourcesNumber === 0 ? "#ACAEB1" : "#0068C5"}
        pointerEvents={rawDataSourcesNumber === 0 && "none"}
        fontWeight="400"
        _hover={{
          color: "#0057A4",
          fill: "#0057A4"
        }}
        href={rawDataSourcesNumber > 0 ? `/dataset/${id}?raw_data_source=${rawDataSources.id}` : "#"}
      >
        <LinkIcon
          alt={t('rawDataSources')}
          width="15px"
          height="15px"
        />
        <Text
          marginLeft="4px !important"
          whiteSpace="nowrap"
        >
          {rawDataSourcesNumber}{" "}
          {rawDataSourcesNumber === 1 ? t('datasetCard.rawDataSource') : t('datasetCard.rawDataSources')}
        </Text>
      </Link>
    )
  }

  const InformationRequest = () => {
    let informationRequestsNumber = informationRequests.number
    if(informationRequests.number === undefined) informationRequestsNumber = 0

    return (
      <Link
        cursor={informationRequestsNumber > 0 ? "pointer" : "normal"}
        color={informationRequestsNumber === 0 ? "#ACAEB1" : "#0068C5"}
        fill={informationRequestsNumber === 0 ? "#ACAEB1" : "#0068C5"}
        pointerEvents={informationRequestsNumber === 0 && "none"}
        fontWeight="400"
        _hover={{
          color: "#0057A4",
          fill: "#0057A4"
        }}
        href={informationRequestsNumber > 0 ? `/dataset/${id}?information_request=${informationRequests.id}` : "#"}
      >
        <InfoArrowIcon
          alt={t('informationRequests')}
          width="15px"
          height="15px"
        />
        <Text
          marginLeft="4px !important"
          whiteSpace="nowrap"
        >
          {informationRequestsNumber}{" "}
          {informationRequestsNumber === 1 ? t('datasetCard.informationRequest') : t('datasetCard.informationRequests')}
        </Text>
      </Link>
    )
  }

  return (
    <VStack
      justifyContent="space-between"
      alignItems="flex-start"
      width="100%"
      spacing={{ base: 4, md: 0 }}
    >
      <Stack
        direction={{ base: "column", lg: "row" }}
        alignItems="flex-start"
        width="100%"
        height="100%"
        spacing={6}
      >
        <Link
          href={`/dataset/${id}`}
          target="_self"
        >
          <Box
            display="flex"
            justifyContent="center"
            border="1px solid #DEDFE0"
            borderRadius="16px"
            _hover={{ opacity: 0.9 }}
          >
            <Image
              src={organization?.picture.startsWith("https://") ? organization?.picture : `https://basedosdados.org/uploads/group/${organization?.name}`}
              alt={organization[`name${capitalize(locale)}`] || organization?.name || t('notProvided')}
              borderRadius="16px"
              minWidth="222px"
              minHeight="138px"
              maxWidth="222px"
              maxHeight="138px"
              objectFit="contain"
            />
          </Box>
        </Link>

        <VStack
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={1}
          width="100%"
          minHeight="115px"
        >
          <VStack width="100%" spacing={1} alignItems="flex-start">
            <Stack
              direction={{ base: "column", lg: "row" }}
              width="100%"
              alignItems="flex-start"
              pb={{ base: 2, lg: 0 }}
            >
              <Link
                href={`/dataset/${id}`}
                width="100%"
                color="#252A32"
                fontWeight="500"
              >
                <Text
                  width="100%"
                  noOfLines={2}
                  textOverflow="ellipsis"
                  fontFamily="Roboto"
                  fontSize="18px"
                  lineHeight="28px"
                  _hover={{
                    opacity: 0.7
                  }}
                >
                  {name}
                </Text>
              </Link>
            </Stack>

            <VStack
              width="100%"
              spacing="8px"
              marginBottom="4px !important"
              alignItems="flex-start"
            >
              <Stack
                direction={{ base: "column", lg: "row" }}
                spacing={1}
              >
                <Text
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#464A51"
                >
                  {t('organization')}:
                </Text>
                <Link
                  href={`/search?organization=${organization?.slug}`}
                  color="#71757A"
                  fontWeight="400"
                  _hover={{
                    color: "#464A51"
                  }}
                >
                  <Text
                    fontFamily="Roboto"
                    fontSize="14px"
                    lineHeight="20px"
                    textOverflow="ellipsis"
                  >
                    {organization[`name${capitalize(locale)}`] || organization?.name}
                  </Text>
                </Link>
              </Stack>

              <Stack
                direction={{ base: "column", lg: "row" }}
                spacing={1}
              >
                <Text
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#464A51"
                >
                  {t('temporalCoverage')}:
                </Text>
                <Text
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#71757A"
                >
                  {temporalCoverageText ? temporalCoverageText : t('noCoverage')}
                </Text>
              </Stack>

              <Stack
                direction={{ base: "column", lg: "row" }}
                spacing={1}
              >
                <Text
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#464A51"
                >
                  {t('resources')}:
                </Text>
                <Text
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#71757A"
                >
                  {contains.free && t('openData')} {contains.free && contains.pro && t('datasetCard.and')} {contains.pro && t('closedData')}
                  {!contains.free && !contains.pro && t('none')}
                </Text>
              </Stack>
            </VStack>
          </VStack>

          <HStack
            flexDirection={useCheckMobile() && "column"}
            alignItems={useCheckMobile() && "flex-start"}
            spacing={0}
            width="100%"
            maxWidth="440px"
            justifyContent="space-between"
          >
            <Tables/>
            <RawDataSources/>
            <InformationRequest/>
          </HStack>
        </VStack>
      </Stack>
    </VStack>
  );
}
