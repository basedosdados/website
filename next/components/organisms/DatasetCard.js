import {
  HStack,
  VStack,
  Center,
  Text,
  Tooltip,
  Stack
} from "@chakra-ui/react";
import { useTranslation } from 'next-i18next';
import { capitalize } from "lodash";
import Card from "../molecules/Card";
import { CategoryIcon } from "../atoms/CategoryIcon";
import Link from "../atoms/Link";
import { DatasetCardTag } from "../atoms/DatasetCardTag";

export default function DatasetCard({
  name,
  themes = [],
  organization,
  tags = [],
  tables,
  rawDataSources,
  informationRequests,
  link,
  locale,
}) {
  const { t } = useTranslation('dataset');
  const databaseInfo = []

  if(tables.number > 0) {
    databaseInfo.push(
      <HStack
        flexDirection="column"
        alignItems="flex-start"
        whiteSpace="nowrap"
        fontFamily="Ubuntu"
        fontSize="14px"
        letterSpacing="0.3px"
        spacing={2}
      >
        <Stack
          margin="0 !important"
          cursor={tables?.number > 0 ? "pointer" : "default"}
          _hover={tables?.number === undefined || tables?.number > 0 ? {opacity : "0.7"} : undefined}
        >
          <Link
            href={tables?.number > 0 ? `${link}?table=${tables?.id}` : ""}
            target="_blank"
            display="flex"
            fontFamily="Ubuntu"
            fontSize="14px"
            letterSpacing="0.3px"
            fontWeight="700"
            color={tables?.number === undefined || tables?.number === 0 ? "#C4C4C4" : "#2B8C4D"}
          >
            {tables?.number === 1 ?
              t('datasetCard.oneTable') :
              t('datasetCard.multipleTables', { count: tables?.number || 0 })
            }
          </Link>
        </Stack>
      </HStack>
    )
  }

  if (rawDataSources.number > 0) {
    databaseInfo.push(
      rawDataSources.number === 1 ?
      t('datasetCard.oneRawDataSource') :
      t('datasetCard.multipleRawDataSources', { count: rawDataSources.number })
    )
  }
  if (informationRequests.number > 0) {
    databaseInfo.push(
      informationRequests.number === 1 ?
      t('datasetCard.oneInformationRequest') :
      t('datasetCard.multipleInformationRequests', { count: informationRequests.number })
    )
  }

  return (
    <Card
      icons={themes.length !== 0 && [
        ...themes.slice(0,6).map((c,i) => (
          <Tooltip
            key={i}
            hasArrow
            bg="#2A2F38"
            label={c.name}
            fontSize="16px"
            fontWeight="500"
            padding="5px 16px 6px"
            marginTop="10px"
            color="#FFF"
            borderRadius="6px"
          >
            <Center
              width="30px"
              height="30px"
              backgroundColor="#2B8C4D"
              borderRadius="6px"
            >
              <Link
                overflow="hidden"
                filter="invert(1)"
                _hover={{ opacity: "none" }}
                href={`/dataset?theme=${c.slug}`}
                target="_blank"
              >
                <CategoryIcon
                  alt={c.name}
                  size="37px"
                  padding="4px"
                  url={`https://storage.googleapis.com/basedosdados-website/theme_icons/${c.slug}.svg`}
                />
              </Link>
            </Center>
          </Tooltip>
        )),
      ]}
      spacing={0}
    >
      <Link href={link}>
        <Text
          fontFamily="Ubuntu"
          fontSize="16px"
          fontWeight="700"
          letterSpacing="0.3px"
          color="#252A32"
          minHeight="40px"
          lineHeight="20px"
          textOverflow="ellipsis"
          marginBottom="10px"
          noOfLines={2}
        >
          {name}
        </Text>
      </Link>
      <Link href={`/dataset?organization=${organization.slug}`}>
        <Text
          noOfLines={2}
          lineHeight="16px"
          textOverflow="ellipsis"
          letterSpacing="0.3px"
          fontFamily="Ubuntu"
          fontSize="12px"
          fontWeight="400"
          color="#6F6F6F"
        >
          {organization[`name${capitalize(locale)}`] || organization.name || organization.slug}
        </Text>
      </Link>

      <VStack spacing={1} align="flex-start" marginTop="auto">
        <HStack
          width="230px"
          margin="8px 0 16px"
        >
          {tags.length !== 0 && tags.slice(0,3).map((t, i) => (
            <DatasetCardTag
              key={i}
              slug={t.slug}
              name={t.name}
              locale={locale}
              display="block"
              aligntext="center"
              whiteSpace="nowrap"
              overflow="hidden"
              minHeight="0"
              textOverflow="ellipsis"
            />
          ))}
        </HStack>

        <Text
          as="div"
          fontFamily="Ubuntu"
          fontSize="12px"
          fontWeight="400"
          letterSpacing="0.3px"
          color="#252A32"
        >
          {databaseInfo[0]}
        </Text>

        <HStack
          spacing={0}
          justifyContent="space-between"
          width="220px"
        >
          <Link
            target="_blank"
            href={rawDataSources.number > 0 ? `${link}?raw_data_source=${rawDataSources.id}` : ""}
            pointerEvents={rawDataSources.number > 0 ? "default" : "none"}
            fontFamily="Ubuntu"
            fontSize="12px"
            fontWeight="400"
            letterSpacing="0.3px"
            color={databaseInfo[1] ? "#252A32" : "#C4C4C4"}
            cursor={databaseInfo[1] && "pointer"}
            _hover={databaseInfo[1] && {opacity : "0.7"}}
          >
            {databaseInfo[1] ? databaseInfo[1] : t('datasetCard.noRawDataSources')}
          </Link>
          <Text color="#DEDFE0">•</Text>
          <Link
            target="_blank"
            href={informationRequests.number > 0 ? `${link}?information_request=${informationRequests.id}` : ""}
            pointerEvents={informationRequests.number > 0 ? "default" : "none"}
            fontFamily="Ubuntu"
            fontSize="12px"
            fontWeight="400"
            letterSpacing="0.3px"
            color={databaseInfo[2] ? "#252A32" : "#C4C4C4"}
            cursor={databaseInfo[2] && "pointer"}
            _hover={databaseInfo[2] && {opacity : "0.7"}}
          >
            {databaseInfo[2] ? databaseInfo[2] : t('datasetCard.noInformationRequests')}
          </Link>
        </HStack>
      </VStack>
    </Card>
  )
}
