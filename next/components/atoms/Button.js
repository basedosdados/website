import {
  Box,
} from "@chakra-ui/react";

export default function Button({ children, onClick, isVariant = false,...props }) {
  return (
    <Box
      as="button"
      onClick={onClick}
      display="flex"
      alignItems="center"
      height="40px"
      width="fit-content"
      borderRadius="8px"
      backgroundColor={isVariant ? "#FFF" : "#2B8C4D"}
      padding="8px 16px"
      cursor="pointer"
      color={isVariant ? "#2B8C4D" : "#FFF"}
      fill={isVariant ? "#2B8C4D" : "#FFF"}
      border={isVariant ? "1px solid #2B8C4D" : ""}
      fontFamily="Roboto"
      fontWeight="500"
      fontSize="14px"
      gap="8px"
      lineHeight="20px"
      _hover={{
        color: isVariant ? "#22703E" : "#FFF",
        borderColor: isVariant ? "#22703E" : "",
        backgroundColor: isVariant ? "#FFF" : "#22703E"
      }}
      {...props}
    >
      {children}
    </Box>
  )
}