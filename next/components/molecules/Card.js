import { Box, HStack, Flex } from "@chakra-ui/react";

export function Card({
  children,
  icons = [],
  spacing = 5,
  padding = "25px 25px 25px 25px",
}) {

  return (
    <Box
      width="280px"
      height="290px"
      boxShadow="0 2px 5px 1px rgba(64, 60, 67, 0.16)"
      _hover={{ boxShadow:"0px 7px 19px 1px rgb(64 60 67 / 16%)" }}
      backgroundColor="#FFFFFF"
      padding={padding}
      borderRadius="10px"
      margin={{ base: "20px 0 !important", lg: "10px 0px" }}
      overflow="hidden"
    >
      <Flex
        flexDirection="column"
        alignItems="flex-start"
        spacing={spacing}
        position="relative"
        height="100%"
      >
        <HStack
          justifyContent="center"
          alignItems="center"
          minHeight="50px"
          paddingBottom="12px"
          spacing={2}
        >
          {icons}
        </HStack>
        {children}
      </Flex>
    </Box>
  );
}
