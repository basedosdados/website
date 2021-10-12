import { VStack } from "@chakra-ui/react";
import Title from "./Title";

export function ShadowBox({ title, children, spacing = 5, ...props }) {
  return (
    <VStack
      padding="20px 30px"
      backgroundColor="white"
      borderRadius="20px"
      border="1.5px solid #E3E3E3"
      width="100%"
      height="100%"
      paddingBottom="30px"
      spacing={spacing}
      position="relative"
      {...props}
    >
      <Title fontSize="28px" fontWeigth="400" letterSpacing="0.1em">
        {title}
      </Title>
      {children}
    </VStack>
  );
}
