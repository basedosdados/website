import { Text } from "@chakra-ui/react";

export default function SectionText({ children, color = "#252A32", ...props }) {
  return (
    <Text
      fontFamily="Lato"
      fontWeight="300"
      lineHeight="24px"
      letterSpacing="0.5px"
      textAlign="justify"
      color={color}
      {...props}
    >
      {children}
    </Text>
  );
}
