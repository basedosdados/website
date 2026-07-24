import {
  Box,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import React from "react";

import BodyText from "../../atoms/Text/BodyText";
import Link from "../../atoms/Link";
import LinkIcon from "../../../public/img/icons/redirectIcon";
import { DataBaseSolidIcon } from "../../../public/img/icons/databaseIcon";
import { CalendarComunIcon } from "../../../public/img/icons/calendarIcon";
import MessageBubbleIcon from "../../../public/img/icons/messageBubbleIcon";

const GRANULARITY_LABEL = {
  day: "dia",
  month: "mês",
  year: "ano",
};

function getDatasetTableUrl(source) {
  const datasetId = source?.dataset_id ?? source?.datasetId;
  const tableId = source?.table_id ?? source?.tableId;
  if (!datasetId) return null;
  const base = `/dataset/${datasetId}`;
  return tableId ? `${base}?table=${tableId}` : base;
}

function formatPeriodDate(date) {
  if (!date || typeof date !== "string") return date;
  return date.replace(/-/g, "/");
}

export function StructuredSectionHeader({ title }) {
  return (
    <BodyText fontWeight="600" color="#2B8C4D">
      {title}
    </BodyText>
  );
}

export const DataSourcesList = React.memo(function DataSourcesList({ dataSources }) {
  if (!Array.isArray(dataSources) || dataSources.length === 0) return null;

  return (
    <Box>
      <StructuredSectionHeader title="Fontes dos Dados"/>
      <VStack align="stretch" spacing={0} marginTop="4px">
        {dataSources.map((source, index) => {
          const href = getDatasetTableUrl(source);
          const label = source?.name ?? "—";
          const rowKey = source?.table_id ?? index;

          const icon = (
            <Box
              as="span"
              display="flex"
              flexShrink={0}
              alignItems="center"
              justifyContent="center"
              width="16px"
              height="16px"
              color="currentColor"
            >
              <DataBaseSolidIcon width="14px" height="14px" fill="currentColor" />
            </Box>
          );

          if (!href) {
            return (
              <HStack
                key={rowKey}
                spacing="8px"
                align="center"
                padding="6px 12px"
                color="#464A51"
              >
                {icon}
                <BodyText typography="small" color="inherit" flex={1}>
                  {label}
                </BodyText>
              </HStack>
            );
          }

          return (
            <Link
              key={rowKey}
              href={href}
              target="_blank"
              width="100%"
              gap="8px"
              padding="6px 12px"
              borderRadius="8px"
              color="#464A51"
              fontWeight="400"
              textDecoration="none"
              transition="color 0.2s ease, background-color 0.2s ease"
              _hover={{
                color: "#FFFFFF",
                backgroundColor: "#55A371",
                textDecoration: "none",
              }}
            >
              {icon}
              <BodyText as="span" typography="small" color="inherit" flex={1}>
                {label}
              </BodyText>
              <Box as="span" display="flex" flexShrink={0} color="currentColor">
                <LinkIcon width="14px" height="14px" fill="currentColor" />
              </Box>
            </Link>
          );
        })}
      </VStack>
    </Box>
  );
});

export const TemporalCoverageInfo = React.memo(function TemporalCoverageInfo({ temporalCoverage }) {
  if (!temporalCoverage) return null;

  const { period_start, period_end, granularity } = temporalCoverage;
  const granularityLabel = GRANULARITY_LABEL[granularity] ?? granularity;
  const formattedStart = formatPeriodDate(period_start);
  const formattedEnd = formatPeriodDate(period_end);

  return (
    <Box>
      <StructuredSectionHeader title="Período Consultado" />
      <HStack spacing="8px" align="flex-start" padding="8px 12px">
        <Box
          as="span"
          display="flex"
          flexShrink={0}
          alignItems="center"
          marginTop="2px"
        >
          <CalendarComunIcon width="16px" height="16px" fill="#71757A" />
        </Box>
        <BodyText typography="small" color="#252A32">
          {period_start === period_end
            ? `${formattedStart} (${granularityLabel})`
            : `${formattedStart} a ${formattedEnd} (${granularityLabel})`}
        </BodyText>
      </HStack>
    </Box>
  );
});

export const FollowUpQuestionsList = React.memo(function FollowUpQuestionsList({ followUpQuestions, onQuestionClick }) {
  if (!Array.isArray(followUpQuestions) || followUpQuestions.length === 0) return null;

  return (
    <Box marginTop="16px">
      <BodyText fontWeight="600" marginBottom="8px" color="#2B8C4D">
        Perguntas Sugeridas
      </BodyText>
      <VStack align="stretch" spacing={0}>
        {followUpQuestions.map((question, index) => (
          <HStack
            key={index}
            as="button"
            type="button"
            width="100%"
            spacing="8px"
            align="center"
            textAlign="left"
            padding="6px 0"
            background="transparent"
            border="none"
            cursor="pointer"
            color="#464A51"
            padding="6px 12px"
            borderRadius="8px"
            transition="color 0.2s ease"
            _hover={{
              color: "#FFFFFF",
              backgroundColor: "#55A371",
            }}
            onClick={() => onQuestionClick?.(question)}
          >
            <MessageBubbleIcon width="14px" height="14px" />
            <BodyText typography="small" color="inherit" flex={1}>
              {question}
            </BodyText>
            <ArrowForwardIcon
              boxSize="14px"
              flexShrink={0}
              color="currentColor"
            />
          </HStack>
        ))}
      </VStack>
    </Box>
  );
});
