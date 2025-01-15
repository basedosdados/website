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
  organizations,
  tags = [],
  tables,
  rawDataSources,
  link,
  locale,
}) {
  const { t } = useTranslation('dataset');

  return (
    <Card
      icons={themes.length !== 0 && [
        ...themes.slice(0,6).map((c,i) => (
          <Tooltip
            key={i}
            label={c.name}
            hasArrow
            padding="16px"
            backgroundColor="#252A32"
            boxSizing="border-box"
            borderRadius="8px"
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="14px"
            lineHeight="20px"
            textAlign="center"
            color="#FFFFFF"
            placement="top"
            maxWidth="160px"
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
                href={`/search?theme=${c.slug}`}
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
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="16px"
          lineHeight="24px"
          color="#252A32"
          minHeight="48px"
          textOverflow="ellipsis"
          marginBottom="10px"
          noOfLines={2}
        >
          {name}
        </Text>
      </Link>
      <Link href={`/search?organization=${organizations?.[0]?.slug}`}>
        <Text
          noOfLines={2}
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="12px"
          lineHeight="18px"
          letterSpacing="0.1px"
          textOverflow="ellipsis"
          color="#71757A"
        >
          {organizations?.[0]?.[`name${capitalize(locale)}`] || organizations?.[0]?.name || organizations?.[0]?.slug}
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

        <HStack
          spacing={0}
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          gap="4px"
        >
          <HStack
            flexDirection="column"
            alignItems="flex-start"
            whiteSpace="nowrap"
            spacing={2}
          >
            <Stack
              margin="0 !important"
              cursor={tables?.number > 0 ? "pointer" : "default"}
              pointerEvents={tables?.number > 0 ? "default" : "none"}
            >
              <Link
                href={tables?.number > 0 ? `${link}?table=${tables?.id}` : ""}
                target="_blank"
                display="flex"
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="12px"
                lineHeight="18px"
                letterSpacing="0.1px"
                color={tables?.number === undefined || tables?.number === 0 ? "#C4C4C4" : "#2B8C4D"}
                _hover={{color: "#22703E"}}
              >
                {
                  tables?.number === 0 ?
                    t('datasetCard.noRawDataSources')
                  :
                  tables?.number === 1 ?
                    t('datasetCard.oneTable')
                    :
                    t('datasetCard.multipleTables', { count: tables?.number || 0 })
                }
              </Link>
            </Stack>
          </HStack>

          <Text color="#71757A">•</Text>

          <HStack
            flexDirection="column"
            alignItems="flex-start"
            whiteSpace="nowrap"
            spacing={2}
          >
            <Stack
              margin="0 !important"
              cursor={rawDataSources?.number > 0 ? "pointer" : "default"}
              pointerEvents={rawDataSources?.number > 0 ? "default" : "none"}
            >
              <Link
                href={rawDataSources?.number > 0 ? `${link}?raw_data_source=${rawDataSources?.id}` : ""}
                target="_blank"
                display="flex"
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="12px"
                lineHeight="18px"
                letterSpacing="0.1px"
                color={rawDataSources?.number === undefined || rawDataSources?.number === 0 ? "#C4C4C4" : "#2B8C4D"}
                _hover={{color: "#22703E"}}
              >
                { 
                  rawDataSources.number === 0 ?
                    t('datasetCard.noRawDataSources')
                    :
                    rawDataSources.number === 1 ?
                      t('datasetCard.oneRawDataSource')
                      :
                      t('datasetCard.multipleRawDataSources', { count: rawDataSources.number })
                }
              </Link>
            </Stack>
          </HStack>
        </HStack>
      </VStack>
    </Card>
  )
}
