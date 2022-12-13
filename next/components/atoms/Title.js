import { Heading } from "@chakra-ui/react";

export default function Title({
  children,
  color = "#252A32",
  ...style
}) {

  return (
    <Heading
      fontFamily="Ubuntu"
      fontSize="18px"
      lineHeight="22px"
      fontWeight="700"
      letterSpacing="0.3px"
      color={color}
      {...style}
    >
      {children}
    </Heading>
  );
}
