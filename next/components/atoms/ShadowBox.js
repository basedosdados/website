import { VStack } from "@chakra-ui/react";
import Title from "./Title";

export function ShadowBox({ title, children, spacing = 5, ...props }) {
  return (
    <VStack
      padding="20px 30px"
      backgroundColor="white"
      borderRadius="20px"
      boxShadow="0 2px 5px 1px rgba(64, 60, 67, 0.16)"
      width="100%"
      height="100%"
      spacing={spacing}
      position="relative"
      {...props}
    >
      <Title fontSize="28px" letterSpacing="0.1em">
        {title}
      </Title>
      {children}
    </VStack>
  );
}
