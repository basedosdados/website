import { Heading } from "@chakra-ui/react";

export default function Title({
  children,
  color = "#2B8C4D",
  fontWeigth = "700",
}) {
  return (
    <Heading
      fontFamily="Montserrat"
      fontSize="22px"
      color={color}
      fontWeight={fontWeigth}
    >
      {children}
    </Heading>
  );
}
