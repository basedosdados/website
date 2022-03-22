import { VStack, Box } from "@chakra-ui/react";
import Title from "./Title";

export function ShadowBox({ title, image, children, spacing = 5, ...props }) {
  return (
    <VStack
      width="100%"
      height="100%"
      spacing={0}
      border={image && "2px solid #DEDFE0"}
      borderRadius="16px"
      overflow="hidden"
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
        padding="20px 30px"
        backgroundColor="white"
        borderRadius="16px"
        border={image ? "" : "1.5px solid #DEDFE0"}
        width="100%"
        height="100%"
        paddingBottom="30px"
        spacing={spacing}
        position="relative"
      >
        <Title fontSize="24px" fontWeigth="400" letterSpacing="0.5px">
          {title}
        </Title>
        {children}
      </VStack>
    </VStack>
  );
}
