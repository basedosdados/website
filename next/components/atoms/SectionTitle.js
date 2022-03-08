import { Heading } from "@chakra-ui/react";

export default function SectionTitle({
  children,
  color = "#000000",
  fontWeigth = "700",
  ...style
}) {
  return (
    <Heading
      fontFamily="Lato"
      fontSize="32px"
      letterSpacing="0.5px"
      color={color}
      fontWeight={fontWeigth}
      {...style}
    >
      {children}
    </Heading>
  );
}
