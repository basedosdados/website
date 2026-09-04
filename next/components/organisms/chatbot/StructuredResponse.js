import {
  Box,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  VStack,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import React, { Fragment } from "react";
import { useTranslation } from "next-i18next";

import BodyText from "../../atoms/Text/BodyText";
import Link from "../../atoms/Link";
import LinkIcon from "../../../public/img/icons/redirectIcon";
import TableChartViewIcon from "../../../public/img/icons/tableChartViewIcon";
import { MessageBubbleCleanIcon } from "../../../public/img/icons/messageBubbleIcon";

function getDatasetTableUrl(source) {
  const datasetId = source?.dataset_id ?? source?.datasetId;
  const tableId = source?.table_id ?? source?.tableId;
  if (!datasetId) return null;
  const base = `/dataset/${datasetId}`;
  return tableId ? `${base}?table=${tableId}` : base;
}

function splitSourceName(name) {
  if (typeof name !== "string" || name.trim() === "") {
    return { dataset: "—", table: null };
  }
  const separatorIndex = name.indexOf(" - ");
  if (separatorIndex === -1) {
    return { dataset: name, table: null };
  }
  return {
    dataset: name.slice(0, separatorIndex).trim(),
    table: name.slice(separatorIndex + 3).trim() || null,
  };
}

function SourceThumbnail({ thumbnailUrl, alt, size = "20px" }) {
  return (
    <Box
      as="span"
      display="flex"
      flexShrink={0}
      alignItems="center"
      justifyContent="center"
      width={size}
      height={size}
      color="#464A51"
      overflow="hidden"
      borderRadius="4px"
      sx={{ svg: { strokeWidth: "1px" } }}
    >
      {thumbnailUrl ? (
        <Box
          as="img"
          src={thumbnailUrl}
          alt={alt}
          width={size}
          height={size}
          objectFit="cover"
        />
      ) : (
        <TableChartViewIcon width={size} height={size} fill="currentColor" />
      )}
    </Box>
  );
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

const DataSourcesMenuListProps = {
  boxShadow: "0px 1.5px 16px rgba(0, 0, 0, 0.16)",
  _focus: { boxShadow: "0px 1.5px 16px rgba(0, 0, 0, 0.16) !important" },
  padding: "0",
  borderRadius: "8px",
  zIndex: "11",
  color: "#252A32",
  minWidth: "260px",
  maxWidth: "340px",
  maxHeight: "320px",
  overflow: "hidden auto",
};

export const DataSourcesButton = React.memo(function DataSourcesButton({ dataSources }) {
  const { t } = useTranslation("chatbot");
  if (!Array.isArray(dataSources) || dataSources.length === 0) return null;

  return (
    <Menu placement="top-start">
      {({ isOpen }) => (
        <>
          <MenuButton
            as={Box}
            display="flex"
            alignItems="center"
            gap="6px"
            padding="8px 12px"
            borderRadius="8px"
            boxSizing="border-box"
            cursor="pointer"
            color="#464A51"
            backgroundColor={isOpen ? "#EEEEEE" : "transparent"}
            _hover={{ backgroundColor: "#EEEEEE" }}
          >
            <Flex alignItems="center" gap="6px">
              <BodyText
                as="span"
                fontSize="14px"
                color="inherit"
                whiteSpace="nowrap"
              >
                {t("ui.sources.count", { count: dataSources.length })}
              </BodyText>
            </Flex>
          </MenuButton>
          <MenuList {...DataSourcesMenuListProps}>
            {dataSources.map((source, index) => {
              const href = getDatasetTableUrl(source);
              const { dataset, table } = splitSourceName(source?.name);
              const thumbnailUrl = source?.thumbnail_url ?? source?.thumbnailUrl;
              const rowKey = source?.table_id ?? index;

              const content = (
                <Flex alignItems="center" gap="10px" width="100%" minWidth={0}>
                  <SourceThumbnail thumbnailUrl={thumbnailUrl} alt={dataset} />
                  <Box minWidth={0} flex={1}>
                    <BodyText
                      as="span"
                      display="block"
                      fontSize="14px"
                      color="#252A32"
                      isTruncated
                    >
                      {dataset}
                    </BodyText>
                    {table && (
                      <BodyText
                        as="span"
                        display="block"
                        fontSize="14px"
                        color="#71757A"
                        isTruncated
                      >
                        {table}
                      </BodyText>
                    )}
                  </Box>
                  {href && (
                    <Box
                      as="span"
                      display="flex"
                      flexShrink={0}
                      color="#464A51"
                    >
                      <LinkIcon width="16px" height="16px" fill="currentColor" />
                    </Box>
                  )}
                </Flex>
              );

              return (
                <Fragment key={rowKey}>
                  {index > 0 && (
                    <MenuDivider margin="0" borderColor="#DEDFE0" />
                  )}
                  <MenuItem
                    as={href ? Link : undefined}
                    href={href || undefined}
                    target={href ? "_blank" : undefined}
                    padding="8px 16px"
                    backgroundColor="#FFF"
                    textDecoration="none"
                    cursor={href ? "pointer" : "default"}
                    _focus={{ backgroundColor: "#F7F7F7" }}
                    _hover={{ backgroundColor: "#F7F7F7", textDecoration: "none" }}
                  >
                    {content}
                  </MenuItem>
                </Fragment>
              );
            })}
          </MenuList>
        </>
      )}
    </Menu>
  );
});

export const FollowUpQuestionsList = React.memo(function FollowUpQuestionsList({ followUpQuestions, onQuestionClick }) {
  if (!Array.isArray(followUpQuestions) || followUpQuestions.length === 0) return null;

  return (
    <Box marginTop="8px">
      <VStack
        align="stretch"
        spacing={0}
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
