import React from "react";
import { Heading } from "@chakra-ui/react";
import { VStack, HStack } from "@chakra-ui/react";

export default function CardCatalog({ sections, containerStyle }) {
  return (
    <VStack
      {...containerStyle}
      alignItems="flex-start"
      spacing={10}
      width="100%"
    >
      {Object.keys(sections).map((key) => (
        <VStack width="100%" alignItems="flex-start" spacing={5}>
          <Heading
            fontSize="20px"
            backgroundColor="#DEDFE0"
            borderRadius="20px"
            padding="10px"
          >
            + {key}
          </Heading>
          <HStack
            overflowY="scroll"
            alignItems="flex-start"
            width="100%"
            spacing={5}
            paddingBottom="10px"
            paddingLeft="5px"
          >
            {sections[key]}
          </HStack>
        </VStack>
      ))}
    </VStack>
  );
}
