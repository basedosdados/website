import { Box, VStack, HStack, Text, Button, useClipboard } from "@chakra-ui/react";
import { useState } from "react";

import BodyText from "../../atoms/Text/BodyText";
import LabelText from "../../atoms/Text/LabelText";

export default function CodeDisplay({ queries }) {
  const [expandedQueries, setExpandedQueries] = useState(new Set());
  const { onCopy, hasCopied } = useClipboard("");

  const toggleQuery = (index) => {
    const newExpanded = new Set(expandedQueries);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQueries(newExpanded);
  };

  const copyQuery = (query) => {
    onCopy(query);
  };

  if (!queries || queries.length === 0) {
    return null;
  }

  return (
    <Box>
      <LabelText typography="x-small" color="#616161" marginBottom={2}>
        {t('generated_queries')}
      </LabelText>
      <VStack spacing={2} align="stretch">
        {queries.map((query, index) => (
          <Box
            key={index}
            backgroundColor="#1A202C"
            borderRadius="8px"
            overflow="hidden"
          >
            {/* Query Header */}
            <HStack
              justify="space-between"
              padding={2}
              backgroundColor="#2D3748"
              borderBottom="1px solid #4A5568"
            >
              <LabelText typography="x-small" color="#E2E8F0" fontWeight="500">
                {t('query')} {index + 1}
              </LabelText>
              <HStack spacing={1}>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => copyQuery(query)}
                  color="#E2E8F0"
                  _hover={{
                    backgroundColor: "#4A5568"
                  }}
                  padding={1}
                  minWidth="auto"
                >
                  {hasCopied ? t('copied') : t('copy')}
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => toggleQuery(index)}
                  color="#E2E8F0"
                  _hover={{
                    backgroundColor: "#4A5568"
                  }}
                  padding={1}
                  minWidth="auto"
                >
                  {expandedQueries.has(index) ? t('collapse') : t('expand')}
                </Button>
              </HStack>
            </HStack>

            {/* Query Content */}
            {expandedQueries.has(index) && (
              <Box padding={3}>
                <Text
                  as="pre"
                  fontSize="xs"
                  color="#E2E8F0"
                  fontFamily="mono"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                  lineHeight="1.4"
                >
                  {query}
                </Text>
              </Box>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
} 