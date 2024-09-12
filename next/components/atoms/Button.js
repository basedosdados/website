import {
  Box,
} from "@chakra-ui/react";

export default function Button({ children, onClick, ...props }) {
  return (
    <Box
      as="button"
      onClick={onClick}
      display="flex"
      alignItems="center"
      height="40px"
      width="fit-content"
      borderRadius="8px"
      backgroundColor="#2B8C4D"
      padding="8px 16px"
      cursor="pointer"
      color="#FFF"
      fill="#FFF"
      fontFamily="Roboto"
      fontWeight="500"
      fontSize="14px"
      gap="8px"
      lineHeight="20px"
      _hover={{
        backgroundColor:"#22703E"
      }}
      {...props}
    >
      {children}
    </Box>
  )
}