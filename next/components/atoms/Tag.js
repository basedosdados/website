import { Box, Heading } from "@chakra-ui/react";

export function Tag({
  children,
  fontWeight,
  hover = true,
  fontSize = "12px",
  ...style
}) {
  return (
    <Box
      padding="6px"
      backgroundColor="#F6F6F6"
      borderRadius="20px"
      textAlign="center"
      {...style}
    >
      <Heading
        fontWeight="400"
        fontSize={fontSize}
        _hover={
          hover
            ? {
                textDecoration: "underline",
              }
            : {}
        }
        fontFamily="Ubuntu"
        letterSpacing="0.1em"
        fontWeight={fontWeight}
      >
        {children}
      </Heading>
    </Box>
  );
}
