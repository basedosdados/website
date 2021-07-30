import { Box, Heading } from "@chakra-ui/react";

export function Tag({ children }) {
  return (
    <Box padding="6px" backgroundColor="#F6F6F6" borderRadius="8px">
      <Heading
        textTransform="capitalize"
        fontWeight="700"
        fontSize="12px"
        fontFamily="Montserrat"
      >
        {children}
      </Heading>
    </Box>
  );
}
