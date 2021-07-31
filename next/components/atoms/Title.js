import { Heading } from "@chakra-ui/react";

export default function Title({
  children,
  color = "black",
  fontWeigth = "700",
  ...style
}) {
  return (
    <Heading
      fontFamily="Ubuntu"
      fontSize="22px"
      color={color}
      fontWeight={fontWeigth}
      {...style}
    >
      {children}
    </Heading>
  );
}
