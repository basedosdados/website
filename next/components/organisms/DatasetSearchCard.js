import {
  HStack,
  Stack,
  VStack,
  Text,
  Box
} from "@chakra-ui/react";
import Image from "next/image";
import { memo } from 'react';
import { useTranslation } from 'next-i18next';
import { capitalize } from "lodash";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import Link from '../atoms/Link';
import TitleText from "../atoms/Text/TitleText";
import BodyText from "../atoms/Text/BodyText";

import LinkIcon from "../../public/img/icons/linkIcon";
import InfoArrowIcon from "../../public/img/icons/infoArrowIcon";
import { DataBaseSolidIcon } from "../../public/img/icons/databaseIcon";

const MetadataRow = ({ label, children }) => (
  <Stack direction={{ base: "column", lg: "row" }} spacing={1}>
    <BodyText typography="small" color="#464A51">
      {label}:
    </BodyText>
    {typeof children === 'string' ? (
      <BodyText typography="small" color="#71757A">
        {children}
      </BodyText>
    ) : (
      children
    )}
  </Stack>
);

const DatasetSearchCard= ({
  id,
  name,
  organizations,
  temporalCoverageText,
  tables,
  rawDataSources,
  informationRequests,
  contains,
  locale
}) => {
  const { t } = useTranslation('dataset');
  const isMobile = useCheckMobile();

  const organizationName = organizations[0]?.[`name${capitalize(locale)}`] || organizations[0]?.name;
  const imageSrc = organizations[0]?.picture?.startsWith("https://") 
    ? organizations[0].picture 
    : `https://basedosdados.org/uploads/group/${organizations[0]?.name}`;
  
  const hasInformationRequests = informationRequests?.number > 0;
  const resourcesText = contains.free 
    ? `${t('openData')}${contains.pro ? ` ${t('datasetCard.and')} ${t('closedData')}` : ''}`
    : contains.pro ? t('closedData') : t('none');

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
        target="_blank"
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
          {tablesNumber} {tablesNumber === 1 ? t('datasetCard.table') : t('datasetCard.tables')}
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
        target="_blank"
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
          {rawDataSourcesNumber} {rawDataSourcesNumber === 1 ? t('datasetCard.rawDataSource') : t('datasetCard.rawDataSources')}
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
        target="_blank"
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
          {informationRequestsNumber} {informationRequestsNumber === 1 ? t('datasetCard.informationRequest') : t('datasetCard.informationRequests')}
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
          target="_blank"
        >
          <Box
            className="img_dataset_serach_card"
            display="flex"
            justifyContent="center"
            border="1px solid #DEDFE0"
            borderRadius="16px"
            overflow="hidden"
            width="222px"
            height={locale !== 'pt' ? "165px" : "138px"}
            position="relative"
            _hover={{ opacity: 0.9 }}
          >
            <Image
              src={imageSrc}
              alt={organizationName || t('notProvided')}
              layout="fill"
              quality={75}
              priority
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
              paddingBottom={{ base: 2, lg: 0 }}
            >
              <Link
                href={`/dataset/${id}`}
                target="_blank"
                width="100%"
              >
                <TitleText
                  typography="small"
                  width="100%"
                  noOfLines={2}
                  textOverflow="ellipsis"
                  _hover={{
                    opacity: 0.7
                  }}
                >
                  {name}
                </TitleText>
              </Link>
            </Stack>

            <VStack
              width="100%"
              spacing="8px"
              marginBottom="4px !important"
              alignItems="flex-start"
            >
              <MetadataRow label={t('organization')}>
                <Link
                  href={`/search?organization=${organizations[0]?.slug}`}
                  target="_blank"
                >
                  <BodyText
                    typography="small"
                    color="#71757A"
                    _hover={{
                      color: "#464A51"
                    }}
                    textOverflow="ellipsis"
                  >
                    {organizationName}
                  </BodyText>
                </Link>
              </MetadataRow>

              <MetadataRow label={t('temporalCoverage')}>
                {temporalCoverageText || t('notProvided')}
              </MetadataRow>

              {/* {locale !== 'pt' && (
                <MetadataRow label={t('spatialCoverage')}>
                  {spatialCoverage || t('notProvided')}
                </MetadataRow>
              )} */}

              <MetadataRow label={t('resources')}>
                {resourcesText}
              </MetadataRow>
              </VStack>
          </VStack>

          <HStack
            flexDirection={isMobile ? "column" : "row"}
            alignItems={isMobile ? "flex-start" : "center"}
            spacing={hasInformationRequests ? 0 : 10}
            width="100%"
            maxWidth="440px"
            justifyContent={hasInformationRequests ? "space-between" : "flex-start"}
          >
            <Tables/>
            <RawDataSources/>
            {hasInformationRequests && (
              <InformationRequest id={id} informationRequests={informationRequests} t={t} />
            )}
          </HStack>
        </VStack>
      </Stack>
    </VStack>
  );
}

export default memo(DatasetSearchCard);