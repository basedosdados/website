import { Center, Box, VStack, HStack, Flex, Link } from "@chakra-ui/react";

export function Card({
  children,
  icons = [],
  spacing = 5,
  padding = "25px 25px 25px 25px",
  link,
}) {
  return (
    <Box
      width="280px"
      height="310px"
      borderRadius="12px"
      boxShadow="0 2px 5px 1px rgba(64, 60, 67, 0.16)"
      backgroundColor="#FFFFFF"
      padding={padding}
      borderRadius="10px"
      margin={{ base: "10px", lg: "10px 0px" }}
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
          paddingBottom="20px"
          spacing={2}
        >
          {icons}
        </HStack>
        {children}
      </Flex>
    </Box>
  );
}
