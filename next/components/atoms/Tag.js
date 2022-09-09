import { Box, Heading } from "@chakra-ui/react";

export function Tag({
  children,
  fontWeight = "400",
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
        fontSize={fontSize}
        fontFamily="Ubuntu"
        letterSpacing="0.5px"
        fontWeight={fontWeight}
      >
        {children}
      </Heading>
    </Box>
  );
}
