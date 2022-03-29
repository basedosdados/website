import { Heading } from "@chakra-ui/react";

export default function SectionTitle({
  children,
  color = "#252A32",
  fontWeigth = "400",
  ...style
}) {
  return (
    <Heading
      fontFamily="Ubuntu"
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
