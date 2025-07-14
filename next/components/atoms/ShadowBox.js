import { VStack, Box } from "@chakra-ui/react";
import LabelText from "./Text/LabelText";

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
      minWidth={{base: "auto", md: "300px"}}
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
        <LabelText
          typography="x-large"
          textAlign="center"
          {...titleStyle}
        >
          {title}
        </LabelText>
        {children}
      </VStack>
    </VStack>
  );
}
