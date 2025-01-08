import { Text } from "@chakra-ui/react";

export default function BodyText({ 
  children, 
  color = "#252A32",
  fontWeight = "300",
  ...props
}) {

  return (
    <Text
      fontFamily="ubuntu"
      fontSize={{base: "17px", md: "18px"}}
      lineHeight={{base: "27px", md: "28px"}}
      letterSpacing="0.1px"
      color={color}
      fontWeight={fontWeight}
      {...props}
    >
      {children}
    </Text>
  );
}
