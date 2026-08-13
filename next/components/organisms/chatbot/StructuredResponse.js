import {
  Box,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import React from "react";
import { useTranslation } from "next-i18next";

import BodyText from "../../atoms/Text/BodyText";
import Link from "../../atoms/Link";
import LinkIcon from "../../../public/img/icons/redirectIcon";
import { DataBaseCleanIcon } from "../../../public/img/icons/databaseIcon";
import { MessageBubbleCleanIcon } from "../../../public/img/icons/messageBubbleIcon";

function getDatasetTableUrl(source) {
  const datasetId = source?.dataset_id ?? source?.datasetId;
  const tableId = source?.table_id ?? source?.tableId;
  if (!datasetId) return null;
  const base = `/dataset/${datasetId}`;
  return tableId ? `${base}?table=${tableId}` : base;
}

export function StructuredSectionHeader({ title }) {
  return (
    <BodyText
      typography="small"
      textTransform="uppercase"
      fontWeight="700"
      width="fit-content"
      letterSpacing="5%"
    >
      {title}
    </BodyText>
  );
}

export const DataSourcesList = React.memo(function DataSourcesList({ dataSources }) {
  const { t } = useTranslation("chatbot");
  if (!Array.isArray(dataSources) || dataSources.length === 0) return null;

  return (
    <Box marginTop="8px">
      <Box paddingX="16px">
        <StructuredSectionHeader title={t("ui.sources.title")} />
      </Box>
      <VStack align="stretch" spacing={0} marginTop="4px" width="100%">
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
              <DataBaseCleanIcon
                width="16px"
                height="16px"
                fill="currentColor"
              />
            </Box>
          );

          const row = !href ? (
            <HStack
              spacing="8px"
              align="center"
              width="100%"
              padding="8px 16px"
              color="#464A51"
              minWidth={0}
            >
              {icon}
              <BodyText color="inherit" flex={1} minWidth={0} isTruncated>
                {label}
              </BodyText>
            </HStack>
          ) : (
            <Link
              href={href}
              target="_blank"
              width="100%"
              minWidth={0}
              gap="8px"
              padding="8px 16px"
              borderRadius="8px"
              color="#464A51"
              fontWeight="400"
              textDecoration="none"
              transition="color 0.2s ease, background-color 0.2s ease"
              _hover={{
                backgroundColor: "#EEEEEE",
                textDecoration: "none",
              }}
            >
              {icon}
              <BodyText
                as="span"
                color="inherit"
                flex={1}
                minWidth={0}
                isTruncated
              >
                {label}
              </BodyText>
              <Box as="span" display="flex" flexShrink={0} color="currentColor">
                <LinkIcon width="16px" height="16px" fill="currentColor" />
              </Box>
            </Link>
          );

          return (
            <Box key={rowKey}>
              {index > 0 && (
                <Box height="1px" backgroundColor="#EEEEEE" marginX="16px" />
              )}
              {row}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
});

export const FollowUpQuestionsList = React.memo(function FollowUpQuestionsList({ followUpQuestions, onQuestionClick }) {
  const { t } = useTranslation("chatbot");
  if (!Array.isArray(followUpQuestions) || followUpQuestions.length === 0) return null;

  return (
    <Box marginTop="24px">
      <Box paddingX="16px">
        <StructuredSectionHeader title={t("ui.suggestedQuestions")} />
      </Box>
      <VStack
        align="stretch"
        spacing={0}
        marginTop="4px"
        width="100%"
      >
        {followUpQuestions.map((question, index) => (
          <Box key={index}>
            {index > 0 && (
              <Box height="1px" backgroundColor="#EEEEEE" marginX="16px" />
            )}
            <HStack
              as="button"
              type="button"
              width="100%"
              spacing="8px"
              align="flex-start"
              textAlign="left"
              padding={{ base: "10px 12px", md: "8px 16px" }}
              background="transparent"
              border="none"
              cursor="pointer"
              color="#464A51"
              borderRadius="8px"
              transition="color 0.2s ease, background-color 0.2s ease"
              _hover={{
                backgroundColor: "#EEEEEE",
              }}
              onClick={() => onQuestionClick?.(question)}
            >
              <Box as="span" display="flex" flexShrink={0} marginTop="2px">
                <MessageBubbleCleanIcon
                  width="16px"
                  height="16px"
                  fill="currentColor"
                />
              </Box>
              <BodyText color="inherit" flex={1} minWidth={0}>
                {question}
              </BodyText>
              <Box as="span" display="flex" flexShrink={0} marginTop="2px">
                <ArrowForwardIcon
                  boxSize="16px"
                  color="currentColor"
                />
              </Box>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
});
