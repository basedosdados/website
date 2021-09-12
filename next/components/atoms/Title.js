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
      fontSize="18px"
      color={color}
      fontWeight={fontWeigth}
      {...style}
    >
      {children}
    </Heading>
  );
}
