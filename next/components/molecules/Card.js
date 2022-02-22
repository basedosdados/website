import { Box, HStack, Flex } from "@chakra-ui/react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

export function Card({
  children,
  icons = [],
  spacing = 5,
  padding = "25px 25px 25px 25px",
  link,
}) {
  const isMobile = useCheckMobile();

  return (
    <Box
      width={isMobile ? "200px" : "280px"}
      height={isMobile ? "210px" : "290px"}
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
