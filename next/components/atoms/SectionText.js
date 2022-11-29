import { Text } from "@chakra-ui/react";

export default function SectionText({ 
  children, 
  color = "#252A32",
  fontSize="14px",
  fontWeight = "300",
  ...props
}) {

  return (
    <Text
      fontFamily="Lato"
      lineHeight="24px"
      letterSpacing="0.5px"
      color={color}
      fontSize={fontSize}
      fontWeight={fontWeight}
      {...props}
    >
      {children}
    </Text>
  );
}
