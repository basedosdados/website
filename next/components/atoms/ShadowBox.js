import { VStack, Box } from "@chakra-ui/react";
import Title from "./Title";

export function ShadowBox({ title, image, children, spacing = 5, ...props}) {
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
        padding="20px 30px"
        backgroundColor="white"
        borderRadius="16px"
        width="100%"
        height="100%"
        minHeight="160px"
        paddingBottom="30px"
        spacing={spacing}
        position="relative"
        border={image && "2px solid #DEDFE0"}
        borderTop="0"
        borderTopRadius="0"
        {...props}
      >
        <Title fontSize="24px" fontWeigth="400" letterSpacing="0.5px">
          {title}
        </Title>
        {children}
      </VStack>
    </VStack>
  );
}
