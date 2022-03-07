import { Flex, HStack, Text, VStack } from "@chakra-ui/react";
import Title from "./Title";

export function SimpleTable({ headers, values, containerStyle }) {
  return (
    <VStack width="100%" height="100%" {...containerStyle}>
      <Flex
        borderWidth="1px 0px"
        borderColor="#E4E4E4"
        width="100%"
        alignItems="flex-start"
        justifyContent="flex-start"
        backgroundColor="#F5F5F5"
      >
        {headers.map((h) => (
          <Title
            padding="5px 15px"
            flex="1"
            fontWeight="500"
            fontSize="14px"
            color="#707070"
            textTransform="capitalize"
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
          flex="1"
        >
          {h.map((r) => (
            <Title
              flex="1"
              fontSize="15px"
              fontWeigth="400"
              padding="6px 15px"
              paddingBottom="3px"
              wordBreak="break-all"
              fontFamily="Lato"
              color="#000000a8"
              _first={{
                color:"#252A32"
              }}
            >
              {r}
            </Title>
          ))}
        </Flex>
      ))}
    </VStack>
  );
}
