import React from "react";
import { Heading } from "@chakra-ui/react";
import { VStack, HStack } from "@chakra-ui/react";

export default function CardCatalog({ sections, containerStyle }) {
  return (
    <VStack {...containerStyle} alignItems="flex-start" width="100%">
      {Object.keys(sections).map((key) => (
        <VStack
          width="100%"
          alignItems="flex-start"
          spacing={5}
          paddingBottom="40px"
        >
          <Heading
            fontSize="16px"
            backgroundColor="#2B8C4D"
            borderRadius="15px"
            color="white"
            fontWeight="500"
            fontFamily="Ubuntu"
            letterSpacing="0.1em"
            padding="10px 15px"
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
