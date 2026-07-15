import {
  Box,
  Text,
  HStack,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import React from "react";

import BodyText from "../../atoms/Text/BodyText";
import Link from "../../atoms/Link";
import LinkIcon from "../../../public/img/icons/redirectIcon";
import { DataBaseIcon } from "../../../public/img/icons/databaseIcon";
import { CalendarComunIcon } from "../../../public/img/icons/calendarIcon";
import { CodeIcon } from "../../../public/img/icons/codeIcon";
import { MemoCodeBlock } from "./markdown";

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

export function StructuredSectionHeader({ icon, title }) {
  return (
    <HStack spacing="8px" alignItems="center" flex={1} minW={0}>
      <Box
        as="span"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
        color="#6B7280"
      >
        {icon}
      </Box>
      <BodyText typography="small" fontWeight="600" color="#6B7280">
        {title}
      </BodyText>
    </HStack>
  );
}

export const DataSourcesList = React.memo(function DataSourcesList({ dataSources }) {
  if (!Array.isArray(dataSources) || dataSources.length === 0) return null;

  return (
    <Box>
      <StructuredSectionHeader
        title="Fontes dos dados"
        icon={<DataBaseIcon width="16px" height="16px" fill="#6B7280"/>}
      />
      <VStack align="stretch" spacing="4px" marginTop="4px">
        {dataSources.map((source, index) => {
          const href = getDatasetTableUrl(source);
          const label = source?.name ?? "—";

          return (
            <Box
              key={source?.table_id ?? index}
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="14px"
              lineHeight="20px"
              color="#252A32"
            >
              {href ? (
                <Link
                  display="inline-flex"
                  alignItems="center"
                  gap="6px"
                  href={href}
                  target="_blank"
                  color="#0068C5"
                  fill="#0068C5"
                  fontWeight="400"
                  _hover={{
                    color: "#0057A4",
                    fill: "#0057A4",
                    textDecoration: "underline",
                  }}
                >
                  <Text as="span">{label}</Text>
                  <LinkIcon width="14px" height="14px" />
                </Link>
              ) : (
                label
              )}
            </Box>
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
      <StructuredSectionHeader
        title="Período consultado"
        icon={<CalendarComunIcon width="16px" height="16px" fill="#6B7280" />}
      />
      <BodyText typography="small" color="#252A32" marginTop="4px">
        {period_start === period_end
          ? `${formattedStart} (${granularityLabel})`
          : `${formattedStart} a ${formattedEnd} (${granularityLabel})`}
      </BodyText>
    </Box>
  );
});

export const SqlQueriesList = React.memo(function SqlQueriesList({ sqlQueries }) {
  if (!Array.isArray(sqlQueries) || sqlQueries.length === 0) return null;

  return (
    <Box width="100%" maxW="100%" minW={0} overflow="hidden">
      <Accordion allowToggle width="100%">
        <AccordionItem border="none" width="100%" minW={0}>
          <AccordionButton
            padding="0"
            width="100%"
            minW={0}
            _hover={{ background: "transparent" }}
            _expanded={{ background: "transparent" }}
          >
            <StructuredSectionHeader
              title="Consultas SQL"
              icon={<CodeIcon width="16px" height="16px" fill="#6B7280"/>}
            />
            <AccordionIcon color="#6B7280" marginLeft="8px" flexShrink={0} />
          </AccordionButton>
          <AccordionPanel
            padding="8px 0 0 0"
            width="100%"
            maxW="100%"
            minW={0}
            overflow="hidden"
          >
            {sqlQueries.map((query, index) => (
              <MemoCodeBlock key={index} language="sql" marginY="8px">
                {query}
              </MemoCodeBlock>
            ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
});

export const FollowUpQuestionsList = React.memo(function FollowUpQuestionsList({ followUpQuestions, onQuestionClick }) {
  if (!Array.isArray(followUpQuestions) || followUpQuestions.length === 0) return null;

  return (
    <Box marginTop="16px">
      <BodyText typography="small" fontWeight="600" color="#6B7280" marginBottom="8px">
        Perguntas sugeridas
      </BodyText>
      <VStack align="stretch" spacing="4px">
        {followUpQuestions.map((question, index) => (
          <HStack
            key={index}
            as="button"
            type="button"
            width="100%"
            spacing="8px"
            align="flex-start"
            textAlign="left"
            padding="6px 0"
            background="transparent"
            border="none"
            cursor="pointer"
            color="#464A51"
            transition="color 0.2s ease"
            _hover={{ color: "#0068C5" }}
            onClick={() => onQuestionClick?.(question)}
          >
            <ArrowForwardIcon
              boxSize="14px"
              flexShrink={0}
              marginTop="3px"
              color="currentColor"
            />
            <BodyText typography="small" color="inherit" flex={1}>
              {question}
            </BodyText>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
});
