import { Text } from "@chakra-ui/react";

export default function SectionText({ 
  children, 
  color = "#252A32",
  fontSize = "14px",
  ...props }) 
{
  return (
    <Text
      fontFamily="Lato"
      fontWeight="300"
      lineHeight="24px"
      letterSpacing="0.5px"
      textAlign="justify"
      fontSize={fontSize}
      color={color}
      {...props}
    >
      {children}
    </Text>
  );
}
