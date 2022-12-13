import { VStack, Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

export function ShadowBox({
  title,
  image,
  children,
  spacing = 5,
  textStyle,
  titleStyle,
  ...props
}) {
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

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
          fontFamily="Ubuntu"
          fontSize="20px"
          fontWeight="400"
          letterSpacing="0.1px"
          color="#252A32"
          {...titleStyle}
        >
          {title}
        </Text>
        {children}
      </VStack>
    </VStack>
  );
}
