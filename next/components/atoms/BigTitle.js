import { Heading } from "@chakra-ui/react";

export default function BigTitle({
  children,
  color = "#252A32",
  fontWeight = "500",
  ...props
}) {
  return (
    <Heading
      fontFamily="Ubuntu"
      fontSize="28px"
      lineHeight="36px"
      letterSpacing="0"
      color={color}
      fontWeight={fontWeight}
      {...props}
    >
      {children}
    </Heading>
  );
}
