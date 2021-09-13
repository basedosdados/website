import { Flex, HStack, Text, VStack } from "@chakra-ui/react";
import Title from "./Title";

export function SimpleTable({ headers, values, containerStyle }) {
  return (
    <VStack width="100%" height="100%" {...containerStyle}>
      <Flex
        borderWidth="1px 0px 1px 1px"
        width="100%"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        {headers.map((h) => (
          <Title
            padding="5px 15px"
            borderRightWidth="1px"
            flex="1"
            fontWeight="bold"
            fontSize="15px"
          >
            {h}
          </Title>
        ))}
      </Flex>
      {values.map((h) => (
        <Flex
          marginTop="0px !important"
          borderBottomWidth="1px"
          height="100%"
          width="100%"
          borderLeftWidth="1px"
          flex="1"
        >
          {h.map((r) => (
            <Title
              borderRightWidth="1px"
              flex="1"
              fontSize="15px"
              fontWeigth="400"
              padding="6px 15px"
              paddingBottom="3px"
              wordBreak="break-all"
            >
              {r}
            </Title>
          ))}
        </Flex>
      ))}
    </VStack>
  );
}
