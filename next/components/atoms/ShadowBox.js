import { VStack, Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

export function ShadowBox({ title, image, children, spacing = 5, ...props}) {

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
        padding="16px 32px 32px"
        backgroundColor="white"
        borderRadius="16px"
        width="100%"
        height="100%"
        minHeight="160px"
        spacing={spacing}
        position="relative"
        border={image && "2px solid #DEDFE0"}
        borderTop="0"
        borderTopRadius="0"
        {...props}
      >
        <Text
          fontFamily="Ubuntu"
          fontSize={isMobileMod ? "20px" : "24px"}
          fontWeigth="400"
          letterSpacing={isMobileMod? "0.2px" : "0px"}
        >
          {title}
        </Text>
        {children}
      </VStack>
    </VStack>
  );
}
