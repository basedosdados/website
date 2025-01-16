import { VStack, Box, Text } from "@chakra-ui/react";

export function ShadowBox({
  title,
  image,
  children,
  spacing = 0,
  textStyle,
  titleStyle,
  ...props
}) {

  return (
    <VStack
      width="300px"
      minWidth="300px"
      height="100%"
      spacing={0}
      borderRadius="16px"
      boxSizing="border-box"
      overflow="hidden"
      marginLeft="0 !important"
      boxShadow="0 1.6px 16px rgba(100, 96, 103, 0.16)"
      {...props}
    >
      {image &&
        <Box
          width="100%"
          height="100%"
        >
          {image}
        </Box>
      }
      <VStack
        padding="24px 20px 32px"
        backgroundColor="white"
        borderRadius="16px"
        width="100%"
        height="100%"
        spacing={spacing}
        position="relative"
        borderTopRadius="0"
        {...textStyle}
      >
        <Text
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="20px"
          lineHeight="30px"
          color="#252A32"
          textAlign="center"
          {...titleStyle}
        >
          {title}
        </Text>
        {children}
      </VStack>
    </VStack>
  );
}
